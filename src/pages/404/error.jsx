import React, { useEffect, useContext } from 'react';
import GoogleLogin from "react-google-login";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "material-react-toastify";
import axios from 'axios';
import { BASE_URL } from '../../constants/index';
import logo from '../../images/hangouts.png';
import "../../css/error.css";


const Error = () => {

    return (

 <section className="page_404 column center">
   <div className="container center column">
       <div className="row center column blue-glue">	
       <div className="col-sm-12 center column blue-glue-child">
       <h1 className="text-center center column">404 </h1>
       <div className="col-sm-10 col-sm-offset-1  text-center center column">
       <div className="four_zero_four_bg center column">
       </div>
       
       <div className="contant_box_404 center column">
       <h3 className="h2 center">
       Look like you're lost
       </h3>
       
       <p>the page you are looking for not avaible!</p>
       
       <a href="/" className="link_404">Go to Home</a>
   </div>
       </div>
       </div>
       </div>
   </div>
</section>


    );
}

export default Error;