import React, { useEffect } from 'react';
import { Link,useHistory } from "react-router-dom";
import "../../css/navbar.css";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import logo from "../../images/hangouts.png"
const Navbar = () => {
    const history = useHistory();
    var userid = localStorage.getItem("tokenId");
    useEffect(()=>{
        if(!userid)
        {
          history.push("/");
        }
    },[]);
    
    function Logout(){
        localStorage.removeItem("tokenId");
        history.push("/");
    }
    return (
        <div>
        <div class="navigation-wrap start-header start-style backdrop-blur center">
            <div class="nav-container">
                <div class="row">
                    <div class="col-12">
                        <nav class="navbar navbar-expand-md navbar-light">

                            <Link class="navbar-brand center" to={"/home/"+userid}><img src={logo} alt="" />&nbsp;HangStream</Link>

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
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" onClick={Logout}>Logout</a>
                                            <a class="dropdown-item" onClick={Logout}>My account</a>
                                        </div>
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