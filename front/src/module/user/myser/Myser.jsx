import React, { useEffect, useState } from "react";
import Footer from "../../../components/footer/Footer";
import "./Myser.css";
import Unav from "../../../components/userNav/Unav";
import { BiCheck } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { useTranslation } from "react-i18next";
import img from "../../../images/Email campaign-amico 1.png";
import codeIMG from "../../../images/Personal site-amico 2.png";
import { GiSandsOfTime } from "react-icons/gi";
import Ser1 from "../../../components/serviceStepTwo/Ser1";
import Ser2 from "../../../components/serviceStepTwo/Ser2";
import Ser3 from "../../../components/serviceStepTwo/Ser3";
import Ser4 from "../../../components/serviceStepTwo/Ser4";
import Ser5 from "../../../components/serviceStepTwo/Ser5";
import Ser6 from "../../../components/serviceStepTwo/Ser6";
import Ser7 from "../../../components/serviceStepTwo/Ser7";
import Ser8 from "../../../components/serviceStepTwo/Ser8";
import ServiceStepTwo from "../serviceStepTwo/ServiceStepTwo";
import Service from "../service/Service";
import { useNavigate } from "react-router-dom";

const Myser = () => {
  const [services, setServices] = useState([]);
  const [step2, setStep2] = useState(false);
  const [id, setId] = useState(0);
  const [service, setService] = useState([]);
  const [status, setStatus] = useState(0);
  const navigate = useNavigate();

  const { t } = useTranslation();
  useEffect(() => {
    axios.defaults.withCredentials = true;
    try {
      axios
        .get(`${API_URL}/auth/check`, { withCredentials: true })
        .then((res) => { })
        .catch((err) => {
          // console.log(err);
          navigate("/Library/login");
        });
      axios
        .get(`${API_URL}/getallwaiting`, { withCredentials: true })
        .then((res) => {
          setServices(res.data);
        })
        .catch((err) => {
          // console.log(err);
          if (err.response.status == 400) {
            navigate("/Library");
          }
        });
    } catch (err) {
      // console.log(err);
    }
  }, []);
  const format = (date) => {
    const formattedDate = new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Extract components from formattedDate
    const [, day, month, year, time] = /(\d+)\/(\d+)\/(\d+), (.+)/.exec(formattedDate);

    // Convert time to 12-hour format with AM/PM
    const [hour, minute, second] = time.split(':');
    const amPm = hour >= 12 ? 'مساءً' : 'صباحا';
    const formattedTime = `${(hour % 12) || 12}:${minute}:${second} ${amPm}`;

    // Combine components to create the final formatted date
    const formattedDateTime = `${day}/${month}/${year}, ${formattedTime}`;

    return formattedDateTime;
  };
  const getTranslatedServiceName = (service) => {
    const currentLanguage = localStorage.getItem("i18nextLng");
    return currentLanguage == "en"
      ? service.service_name
      : service.service_name_ar;
  };

  const handleRoute = (id) => {
    setStep2(true);
  };

  return id !== 0 && status !== 4 ? (
    <ServiceStepTwo ID={id} Ser={service} />
  ) : id !== 0 && status == 4 ? (
    <Service ID={id} Ser={service} />
  ) : (
    <div>
      <section id="services">
        <h2>{t("waiting-list")}</h2>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "400",
          lineHeight: "1.5",
          textAlign: "center",
          opacity: "0.8",
          margin: 'auto auto 1rem auto'
        }}>
          {t("ser-status-notes")}
        </h2>
        {Array.isArray(services) && services.map((service) => {
          let type = 0;
          if (service.ser_reg != null) {
            type = service.ser_reg;
          } else if (service.ser_formation) {
            type = service.ser_formation;
          } else if (service.ser_personal != null) {
            type = service.ser_personal;
          } else if (service.ser_magazine != null) {
            type = service.ser_magazine;
          } else if (service.ser_upgrade != null) {
            type = service.ser_upgrade;
          } else if (service.ser_best != null) {
            type = service.ser_best;
          } else if (service.ser_grant != null) {
            type = service.ser_grant;
          } else if (service.ser_knowledge != null) {
            type = service.ser_knowledge;
          }

          return service.status === 5 || service.status === 6 ? null : (
            <div className="inst">
              <div className="inst-container">
                <div className="information-service">
                  <div
                    className="information-service_body"
                    style={{
                      backgroundColor: "#fff",
                      color: "#000",
                      width: "100%",
                    }}
                  >
                    <h1 style={{ fontSize: "2rem" }}>
                      {getTranslatedServiceName(service)}
                    </h1>
                    <hr style={{ width: "60%" }} />
                    <img
                      src={service.status == 1 ? codeIMG : img}
                      alt=""
                      style={{ width: "50%" }}
                    />
                    <h5>
                      {service.distribution_date != null && service.distribution_date != "" ? (
                        <>
                          {t("wait-res-date")} : {format(service.distribution_date)}
                        </>
                      ) : service.status == 2 && service.distribution_date == null || service.distribution_date == "" ? (
                        <>
                          {t("wait-res-date")} : {t("wait-res-date-null")}
                        </>
                      ) : null}
                    </h5>

                    {service.status == 0 ? (
                      <>
                        {service.service_id != 7 || service.service_id != 8 ? (
                          <p className="wait-p">
                            {localStorage.getItem("i18nextLng") == "ar" ? service.payment_note_ar : service.payment_note}
                          </p>
                        ) : null}
                        <h2
                          style={{
                            backgroundColor: "#AD8700",
                            color: "#000",
                            borderRadius: "10px",
                            padding: "10px",
                            fontSize: "2rem",
                            fontWeight: "500",
                            lineHeight: "1.5",
                            width: "80%",
                            margin: "1rem auto",
                          }}
                        >
                          <GiSandsOfTime />
                          {t("service1-step3-w")}

                        </h2>
                      </>
                    ) : service.status == 1 ? (
                      <>
                        <div className="contiue">
                          {service.service_id != 7 || service.service_id != 8 ? (
                            <p className="wait-p">
                              {localStorage.getItem("i18nextLng") == "ar" ? service.payment_note_ar : service.payment_note}
                            </p>
                          ) : null}
                          <h3>{t("payment-code")}</h3>
                          <div className="code wait-txt">
                            {service.payment_code}
                          </div>
                          <button
                            className="waitbtn-edit"
                            onClick={() => {
                              handleRoute(service.service_id);
                              setId(service.service_id);
                              setService(service);
                            }}
                          >
                            {t("continue")}
                          </button>
                        </div>
                      </>
                    ) : service.status == 2 ? (
                      <>
                        <h2
                          style={{
                            backgroundColor: "#AD8700",
                            color: "#000",
                            borderRadius: "10px",
                            padding: "10px",
                            fontSize: "2rem",
                            fontWeight: "500",
                            lineHeight: "1.5",
                            width: "80%",
                          }}
                        >
                          <GiSandsOfTime />
                          {t("wait-res")}
                        </h2>

                      </>
                    ) : service.status == 3 ? (
                      <>
                        <h2 className="wait-txt">
                          <GiSandsOfTime />
                          {service.response_text}
                        </h2>
                        <button
                          className="waitbtn-edit"
                          onClick={() => {
                            handleRoute(service.service_id);
                            setId(service.service_id);
                            setService(service);
                          }}
                        >
                          {t("wait-edit")}
                        </button>
                      </>
                    ) : service.status == 4 ? (
                      <>
                        <h2 className="wait-txt">
                          <GiSandsOfTime />
                          {service.response_text}
                        </h2>
                        <button
                          className="waitbtn-edit"
                          onClick={() => {
                            handleRoute(service.service_id);
                            setId(service.service_id);
                            setService(service);
                            setStatus(service.status);
                          }}
                        >
                          {t("wait-edit")}
                        </button>
                      </>
                    ) : null}

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default Myser;
