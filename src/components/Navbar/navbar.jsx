import React from 'react';
import "../../css/navbar.css";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import logo from "../../images/hangouts.png"
const Navbar = () => {
    return (
        <div>
        <div class="navigation-wrap start-header start-style backdrop-blur center">
            <div class="nav-container">
                <div class="row">
                    <div class="col-12">
                        <nav class="navbar navbar-expand-md navbar-light">

                            <a class="navbar-brand center" href="/"><img src={logo} alt="" />&nbsp;HangStream</a>

                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>

                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav ml-auto py-4 py-md-0">

                                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                                        <a class="nav-link " href="/">Home</a>
                                    </li>

                                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4 ">
                                        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Account<AccountCircleOutlinedIcon/></a>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" href="meet">Logout</a>
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