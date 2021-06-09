import React,{useEffect,useContext} from 'react';
import GoogleLogin from "react-google-login";
import {useHistory} from "react-router-dom";
import { ToastContainer, toast } from "material-react-toastify";
import axios from 'axios';

import {BASE_URL} from '../../constants/index';
import logo from '../../images/hangouts.png';
import "../../css/login.css";


const Login = ()=>{
    const history = useHistory();
    useEffect(()=>{
        var tokenId=localStorage.getItem("tokenId")
        if(tokenId){
            history.push(`/home/${tokenId}`);
        }
    },[])

    const responseSuccessGoogle=(response)=>{        
       axios.post(`${BASE_URL}/credentials`,{...response.profileObj}).then((res)=>{
            localStorage.setItem("tokenId",res.data.id);
            history.push(`/home/${res.data.id}`);
        })
    }
    const responseErrorGoogle=(response)=>{
        toast.error(`${response.details}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
    }



    return(
        <>
        <div className="login-main center">
        <div className="login-box center column">
            <img src={logo}/>
            <h4>Hangstream</h4>
            <GoogleLogin
            clientId="857139218088-qhn8a18fashrmakebvo4u0fi25uooqg1.apps.googleusercontent.com"
            buttonText="Login to let fun begin"
            onSuccess={responseSuccessGoogle}
            onFailure={responseErrorGoogle}
            cookiePolicy={"single_host_origin"}
            />
        </div>
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
        </div>
        </>
    );
}

export default Login;