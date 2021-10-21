import React, { useState, useContext, useEffect } from 'react';
import { Link,useHistory } from "react-router-dom";
import "../../css/navbar.css";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import logo from "../../images/hangouts.png"
import {Theme} from '../../userContext/userdetails'
const Navbar = () => {

    const history = useHistory();
    var userid = localStorage.getItem("tokenId");
    var { theme,setTheme } = useContext(Theme); 
    useEffect(()=>{
        if(!userid)
        {
          history.push("/");
        }
        if(theme==="dark-theme")
        {
          setDarkStatus(true);  
        }
    },[]);
    
    function Logout(){
        localStorage.removeItem("tokenId");
        history.push("/");
    }
    const [darkStatus,setDarkStatus] = useState(false);
    function  Themer() {
        if(!darkStatus){
            setTheme("dark-theme");
        }
        else{
            setTheme("light-theme");
        }
        setDarkStatus(!darkStatus);
    }
    return (
        <div>
        <div className="navigation-wrap start-header start-style center" id={theme}>
            <div class="nav-container">
                <div class="row">
                    <div class="col-12">
                        <nav class="navbar navbar-expand-md navbar-light">

                            <Link class="navbar-brand center" to={"/home/"+userid}><img src={logo} alt="" />&nbsp;Hangstream</Link>

                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>

                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav ml-auto py-4 py-md-0">

                                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                                        <Link class="nav-link " to={"/home/"+userid}>Home</Link>
                                    </li>

                                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                                        <Link class="nav-link " to={"/movies"}>Streamflix</Link>
                                    </li>

                                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4 ">
                                        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Account<AccountCircleOutlinedIcon/></a>
                                        <div class="dropdown-menu" id={theme+"-dropdown"}>
                                            <a class="dropdown-item" onClick={Logout}>Logout</a>
                                            <Link class="dropdown-item" to={"/account"} >My account</Link>
                                        </div>
                                    </li>
                                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                                        <Link class="nav-link " onClick={Themer}>{darkStatus?<Brightness2Icon style={{transition:"2s",color: "#d9dbdc",transform:"rotate(45deg)"}}/>:<WbSunnyIcon className="theme-choice" />}</Link>
                                    </li>
                                </ul>
                            </div>

                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div className="gap-filler"/>

        </div>
    );
}

export default Navbar;