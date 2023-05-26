import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../css/navbar.css";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import SearchIcon from "@material-ui/icons/Search";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import logo from "../../images/hangouts.png";
import { Theme } from "../../userContext/userdetails";
import SearchResult from "./searchresult";
import axios from "axios";
import { BASE_URL } from "../../constants/index";
import { ToastContainer, toast } from "material-react-toastify";

const Navbar = () => {
  const history = useHistory();
  var userid = localStorage.getItem("tokenId");
  var { theme, setTheme } = useContext(Theme);
  const [searchbar, setSearchbar] = useState("searchbar-close");
  const [users, setUsers] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    if (!userid) {
      history.push("/");
    }
    if (theme === "dark-theme") {
      setDarkStatus(true);
    }
    if (!sessionStorage.getItem("users")) {
      axios.get(`${BASE_URL}/home/getusers`).then((res) => {
        if (res) {
          sessionStorage.setItem("users", JSON.stringify(res));
          setUsers(JSON.parse(sessionStorage.getItem("users")).data);
        }
      });
    } else setUsers(JSON.parse(sessionStorage.getItem("users")).data);
  }, []);

  function Logout() {
    localStorage.removeItem("tokenId");
    history.push("/");
  }
  const [darkStatus, setDarkStatus] = useState(false);
  const Themer = ()=> {
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
          <div className="nav-container">
            <div className="row">
              <div className="col-12">
                <nav className="navbar navbar-expand-md navbar-light">
                  <Link className="navbar-brand center" to={"/home/" + userid}>
                    <img src={logo} alt="" />
                    &nbsp;Hangstream
                  </Link>

                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>

                  <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <ul className="navbar-nav ml-auto py-4 py-md-0">
                      <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link className="nav-link " to={"/home/" + userid}>
                          Home
                        </Link>
                      </li>

                      <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link className="nav-link " to={"/streamflix"}>
                          Streamflix
                        </Link>
                      </li>

                      <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4 ">
                        <a
                          className="nav-link dropdown-toggle"
                          data-toggle="dropdown"
                          href="#"
                          role="button"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Account
                          <AccountCircleOutlinedIcon />
                        </a>
                        <div className="dropdown-menu" id={theme + "-dropdown"}>
                          <a className="dropdown-item" onClick={Logout}>
                            Logout
                          </a>
                          <Link className="dropdown-item" to={"/account"}>
                            My account
                          </Link>
                        </div>
                      </li>
                      <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <a className="nav-link " onClick={Themer}>
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
                        </a>
                      </li>
                      <li className=" pl-4 pl-md-0 ml-0 ml-md-4">
                        <a
                          className="nav-link "
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
                        </a>
                        <input
                          className={searchbar + " " + theme + "-search"}
                          name="episode"
                          placeholder="Search user or movie"
                          value={searchText}
                          onChange={DynamicSearch}
                          onBlur={() => {setSearchbar("searchbar-close");SetSearchText("");setSearchResult([])}}
                          autoComplete="off"
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
      {searchResult.length > 0 && searchText.length > 0 && (
        <SearchResult result={searchResult} />
      )}
      <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
    </>
  );
};

export default Navbar;
