import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../css/navbar.css";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import SearchIcon from "@material-ui/icons/Search";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import logo from "../../images/hangouts.png";
import { Theme } from "../../userContext/userdetails";
import axios from "axios";
import { BASE_URL } from "../../constants/index";
import { FunctionsRounded } from "@material-ui/icons";
//import SearchResult from "./Searchresult";

const Navbar = () => {
  const history = useHistory();
  var userid = localStorage.getItem("tokenId");
  var { theme, setTheme } = useContext(Theme);
  const [darkStatus, setDarkStatus] = useState(false);
  const [searchbar, setSearchbar] = useState("searchbar-close");
  const [users, setUsers] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    if (!sessionStorage.getItem("users")) {
      axios.get(`${BASE_URL}/home/getusers`).then((res) => {
        if (res) {
          sessionStorage.setItem("users", JSON.stringify(res));
          setUsers(JSON.parse(sessionStorage.getItem("users")).data);
        }
      });
    } else setUsers(JSON.parse(sessionStorage.getItem("users")).data);
  }, []);

  useEffect(() => {
    if (!userid) {
      history.push("/");
    }
    if (theme === "dark-theme") {
      setDarkStatus(true);
    }
  }, []);

  function Logout() {
    localStorage.removeItem("tokenId");
    history.push("/");
  }

  function Themer() {
    if (!darkStatus) {
      setTheme("dark-theme");
    } else {
      setTheme("light-theme");
    }
    setDarkStatus(!darkStatus);
  }

  function DynamicSearch(e) {
    SetSearchText(e.target.value);
    var u = users.filter((list) => {
      var x = list.username.replace(/\s+/g, "").trim().toLowerCase();
      return x.includes(
        e.target.value.replace(/\s+/g, "").trim().toLowerCase()
      );
    });
    setSearchResult(u);
  }

  return (
    <>
      <div>
        <div
          className="navigation-wrap start-header start-style center"
          id={theme}
        >
          <div class="nav-container">
            <div class="row">
              <div class="col-12">
                <nav class="navbar navbar-expand-md navbar-light">
                  <Link class="navbar-brand center" to={"/home/" + userid}>
                    <img src={logo} alt="" />
                    &nbsp;Hangstream
                  </Link>

                  <button
                    class="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span class="navbar-toggler-icon"></span>
                  </button>

                  <div
                    class="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <ul class="navbar-nav ml-auto py-4 py-md-0">
                      <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link class="nav-link " to={"/home/" + userid}>
                          Home
                        </Link>
                      </li>

                      <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link class="nav-link " to={"/movies"}>
                          Streamflix
                        </Link>
                      </li>

                      <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4 ">
                        <a
                          class="nav-link dropdown-toggle"
                          data-toggle="dropdown"
                          href="#"
                          role="button"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Account
                          <AccountCircleOutlinedIcon />
                        </a>
                        <div class="dropdown-menu" id={theme + "-dropdown"}>
                          <a class="dropdown-item" onClick={Logout}>
                            Logout
                          </a>
                          <Link class="dropdown-item" to={"/account"}>
                            My account
                          </Link>
                        </div>
                      </li>
                      <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link class="nav-link " onClick={Themer}>
                          {darkStatus ? (
                            <Brightness2Icon
                              style={{
                                transition: "2s",
                                color: "#d9dbdc",
                                transform: "rotate(45deg)",
                              }}
                            />
                          ) : (
                            <WbSunnyIcon className="theme-choice" />
                          )}
                        </Link>
                      </li>
                      <li class=" pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link
                          class="nav-link "
                          onClick={() => setSearchbar("searchbar-expand")}
                        >
                          {darkStatus ? (
                            <SearchIcon
                              style={{
                                transition: "2s",
                                color: "#d9dbdc",
                              }}
                            />
                          ) : (
                            <SearchIcon className="theme-choice" />
                          )}
                        </Link>
                        <input
                          className={searchbar + " " + theme + "-search"}
                          name="episode"
                          placeholder="Search user or movie"
                          value={searchText}
                          onBlur={() => setSearchbar("searchbar-close")}
                          onChange={DynamicSearch}
                          autocomplete="off"
                        />
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-filler" />
      </div>
      {/* {searchResult.length > 0 && searchText.length > 0 && (
        <SearchResult result={searchResult} />
      )} */}
    </>
  );
};

export default Navbar;
