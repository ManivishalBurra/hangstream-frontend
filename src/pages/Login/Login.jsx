import React,{useEffect,useContext} from 'react';
import GoogleLogin from "react-google-login";
import {useHistory} from "react-router-dom";
import axios from 'axios';

import {BASE_URL} from '../../constants/index';
import logo from '../../images/hangouts.png';
import "../../css/login.css";


const Login = ()=>{
    const history = useHistory();
    

    const responseSuccessGoogle=(response)=>{        
       axios.post(`${BASE_URL}/credentials`,{...response.profileObj}).then((res)=>{
            
            localStorage.setItem("tokenId",res.data.id);
            history.push(`/home/${res.data.id}`);
        })
    }
    const responseErrorGoogle=(response)=>{
        console.log(response);
    }



    return(
        <>
        <div className="login-main center">
        <div className="login-box center column">
            <img src={logo}/>
            <h4>Hangstream</h4>
            <GoogleLogin
            clientId="580863925164-oia6u7ik0d615te3187o7dufds2j6m93.apps.googleusercontent.com"
            buttonText="Login to let fun begin"
            onSuccess={responseSuccessGoogle}
            onFailure={responseErrorGoogle}
            cookiePolicy={"single_host_origin"}
            />
        </div>
        </div>
        </>
    );
}

export default Login;