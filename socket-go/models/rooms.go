package models

import (
	"github.com/gorilla/websocket"
)

type House struct {
	Rooms 		[]Room
}

type Room struct {
	RoomId 		string
	User		[]Users
}

type Users struct {
	UserId 		string
	RoomId 		string
	Conn 		*websocket.Conn
	Send 		chan []byte
	Hub 		*Hub
}

type Hub struct {
	Users	map[*Users]bool
	Broadcast chan []byte
	Register chan *Users
	UnRegister chan *Users
}

type Message struct {
	Data []byte
	RoomId string
	UserId string
}