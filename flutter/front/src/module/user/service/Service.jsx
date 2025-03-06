import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Unav from "../../../components/userNav/Unav";
import Footer from "../../../components/footer/Footer";
import Ser1 from "../../../components/sevices/Ser1";
import Ser2 from "../../../components/sevices/Ser2";
import Ser3 from "../../../components/sevices/Ser3";
import Ser4 from "../../../components/sevices/Ser4";
import Ser5 from "../../../components/sevices/Ser5";
import Ser6 from "../../../components/sevices/Ser6";
import Ser7 from "../../../components/sevices/Ser7";
import Ser8 from "../../../components/sevices/Ser8";
import axios from "axios";
import { API_URL } from "../../../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Serimg from "../../../images/serIMG.png";

import "./service.css";

const Service = (ID, Ser) => {
  let { id } = useParams();
  const navigate = useNavigate();

  if (id === undefined) {
    id = ID.ID;
  }
  const ser = ID.Ser;

  useEffect(() => {
    axios.defaults.withCredentials = true;

    try {
      axios
        .get(`${API_URL}/auth/check`, { withCredentials: true })
        .then((res) => { })
        .catch((err) => {
          // console.log(err);
          window.location.replace("/Library/login");
        });
    } catch (err) {
      // console.log(err);
    }
  }, []);

  const Service = (id) => {
    switch (id) {
      case "1":
        return <Ser1 />;
      case 1:
        return <Ser1 ser={ser} />;
      case "2":
        return <Ser2 />;
      case 2:
        return <Ser2 ser={ser} />;
      case "3":
        return <Ser3 />;
      case 3:
        return <Ser3 ser={ser} />;
      case "4":
        return <Ser4 />;
      case 4:
        return <Ser4 ser={ser} />;
      case "5":
        return <Ser5 />;
      case 5:
        return <Ser5 ser={ser} />;
      case "6":
        return <Ser6 />;
      case 6:
        return <Ser6 ser={ser} />;
      case "7":
        return <Ser7 />;
      case 7:
        return <Ser7 ser={ser} />;
      case "8":
        return <Ser8 />;
      case 8:
        return <Ser8 ser={ser} />;

      default:
        return <h1>Wrong </h1>;
    }
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      {/* <div className="Cont-Serv"> */}
      {/* <img src={Serimg} alt="" className='ImageService'/> */}
      {Service(id)}
      {/* </div> */}
      {/* <Footer /> */}
    </div>
  );
};

export default Service;
