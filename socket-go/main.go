package main

import (
	"encoding/json"

	"github.com/gin-gonic/gin"

	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

type Message struct {
	Data       interface{} `json:"data"`
	Room       string      `json:"room"`
	User       string      `json:"user"`
	ProfilePic string      `json:"profilepic"`
	Type       string      `json:"type"`
}

type user struct {
	conn *connection
	room string
	// user string
}

// connection is an middleman between the websocket connection and the hub.
type connection struct {
	// The websocket connection.
	ws *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte
}

// House maintains the set of active connections and broadcasts messages to the
// connections.
type House struct {
	// Registered connections.
	rooms map[string]map[*connection]bool

	// Inbound messages from the connections.
	broadcast chan Message

	// Register requests from the connections.
	register chan user

	// Unregister requests from connections.
	unregister chan user
}

var house = House{
	broadcast:  make(chan Message),
	register:   make(chan user),
	unregister: make(chan user),
	rooms:      make(map[string]map[*connection]bool),
}

func (h *House) run() {
	for {
		select {
		case s := <-house.register:
			connections := house.rooms[s.room]
			if connections == nil {
				connections = make(map[*connection]bool)
				house.rooms[s.room] = connections
			}
			house.rooms[s.room][s.conn] = true
		case s := <-house.unregister:
			connections := house.rooms[s.room]
			if connections != nil {
				if _, ok := connections[s.conn]; ok {
					delete(connections, s.conn)
					close(s.conn.send)
					if len(connections) == 0 {
						delete(house.rooms, s.room)
					}
				}
			}
		case m := <-house.broadcast:
			connections := house.rooms[m.Room]
			jsonData, err := json.Marshal(m)
			if err != nil {
				fmt.Println("Failed to marshal struct to JSON:", err)
				return
			}
			byteSlice := []byte(jsonData)
			for c := range connections {
				select {
				case c.send <- byteSlice:
				default:
					close(c.send)
					delete(connections, c)
					if len(connections) == 0 {
						delete(house.rooms, m.Room)
					}
				}
			}
		}
	}
}

const (
	// Time allowed to write a Message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong Message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum Message size allowed from peer.
	maxMessageSize = 2460
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  2460,
	WriteBufferSize: 2460,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// readPump pumps messages from the websocket connection to the hub.
func (s user) readPump() {
	c := s.conn
	defer func() {
		house.unregister <- s
		c.ws.Close()
	}()
	c.ws.SetReadLimit(maxMessageSize)
	c.ws.SetReadDeadline(time.Now().Add(pongWait))
	c.ws.SetPongHandler(func(string) error { c.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, msg, err := c.ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v", err)
			}
			log.Printf("error: %v", err)
			break
		}
		var m Message
		err = json.Unmarshal(msg, &m)
		if err != nil {
			fmt.Println("Failed to unmarshal JSON:", err)
			return
		}

		house.broadcast <- m
	}
}

// write writes a Message with the given Message type and payload.
func (c *connection) write(mt int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

// writePump pumps messages from the hub to the websocket connection.
func (s *user) writePump() {
	c := s.conn
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.write(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func serveWs(w http.ResponseWriter, r *http.Request, roomId string) {
	fmt.Print(roomId)
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err.Error())
		return
	}
	newConnection := &connection{send: make(chan []byte, 256), ws: ws}
	newUser := user{newConnection, roomId}
	house.register <- newUser
	go newUser.writePump()
	go newUser.readPump()
}

func main() {
	go house.run()

	router := gin.New()
	router.LoadHTMLFiles("index.html")

	router.GET("/room/:roomId", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	router.GET("/ws/:roomId", func(c *gin.Context) {
		roomId := c.Param("roomId")
		log.Println("Create room", roomId)
		serveWs(c.Writer, c.Request, roomId)
	})

	router.Run(":6303")
}
