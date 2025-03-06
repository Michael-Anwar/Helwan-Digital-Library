import React, { useEffect, useState } from "react";
import Footer from "../../../components/footer/Footer";
import "./home.css";
import Unav from "../../../components/userNav/Unav";
import { BiCheck } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Coplaints from "../../../components/complains/Coplaints";
import Profit from "../../../components/profit/Profit";
import PopupError from "../../../components/error/PopupErrorMsg";
import PopupMsgImg from "../../../components/error/PopupMsgImg";
import img from "../../../images/uni-logo.png";
import img2 from "../../../images/124509.jpg"
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';


const Home = () => {
  const [services, setServices] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({});

  useEffect(() => {
    axios.defaults.withCredentials = true;
    try {
      axios
        .get(`${API_URL}/user/getAllServices`, { withCredentials: true })
        .then((res) => {
          setServices(res.data);
        })
        .catch((err) => {
          // console.log(err);
        });

      axios
        .get(`${API_URL}/admin/getAllevents`, { withCredentials: true })
        .then((res) => {
          setEvents(res.data);
        })
        .catch((err) => {
          // console.log(err);
        });
    } catch (err) {
      // console.log(err);
    }
  }, []);

  const getTranslatedServiceName = (service) => {
    const currentLanguage = localStorage.getItem("i18nextLng");
    return currentLanguage == "en"
      ? service.service_name
      : service.service_name_ar;
  };
  const getTranslatedServicePref = (service) => {
    const currentLanguage = localStorage.getItem("i18nextLng");
    return currentLanguage == "en" ? service.pref : service.pref_ar;
  };

  const handleNavegate = () => {
    navigate("/Library/allServices");
  };
  const handleCloseError = () => {
    setError("");
    setVisible(false);
  };



  return (
    <div>
      {error && <PopupError message={error} onClose={handleCloseError} />}
      {visible && <PopupMsgImg event={eventDetails} onClose={handleCloseError} />}
      <main>

        <div
          className="intro-txt"
          style={
            localStorage.getItem("i18nextLng") == "en"
              ? { alignItems: "flex-start" }
              : { alignItems: "flex-end", textAlign: "right" }
          }
        >
          <h1>{t("helwan-uni")}</h1>
          <h2>{t("lib")}</h2>
          <h3 style={{ width: "50%" }}>{t("info-lib")}</h3>
        </div>
      </main>
      <section
        id="services"
        style={
          localStorage.getItem("i18nextLng") == "en"
            ? { direction: "ltr" }
            : { direction: "rtl" }
        }
      >
        <Fade left duration={1500}>
          <h2>{t("services-title")}</h2>
        </Fade>
        <Fade right duration={1500}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "400",
              lineHeight: "1.5",
              width: "80%",
              textAlign: "center",
              opacity: "0.8",
            }}
          >
            {t("services-info")}
          </h2>
        </Fade>

        <div className="services__container">
          {Array.isArray(services) &&
            services.map((service, index) => {
              if (index >= 3) {
                return null; // Skip rendering for index >= 5
              }
              return (
                <Zoom top duration={1700} key={service.id}>
                  <article
                    className="services"
                    style={
                      localStorage.getItem("i18nextLng") == "en"
                        ? { direction: "ltr" }
                        : { direction: "rtl" }
                    }
                  >
                    <div className="service__head">
                      <h1>{getTranslatedServiceName(service)}</h1>
                    </div>
                    <hr />
                    <ul className="service__list">
                      <li className="li-article">
                        <BiCheck className="service__list-icon" />
                        <p>{getTranslatedServicePref(service)}</p>
                      </li>
                      {service.enabled ? (
                        <li className="bttn">
                          <Link to={`/Library/instructions/${service.id}`}>
                            {t("more-det")}
                          </Link>
                        </li>
                      ) : (
                        <li
                          className="bttn"
                          onClick={() => {
                            setError(t("stop"));
                          }}
                        >
                          <Link>{t("more-det")}</Link>
                        </li>
                      )}
                    </ul>
                  </article>
                </Zoom>
              );
            })}
        </div>
        <button className="more-Services" onClick={handleNavegate}>
          {t("more")}
        </button>
      </section>
      <hr style={{ width: "90%", margin: "auto" }} />

      {events.length > 0 && (
        <section
          id="services"
          style={
            localStorage.getItem("i18nextLng") == "en"
              ? { direction: "ltr" }
              : { direction: "rtl" }
          }
        >
          <Fade left duration={1500}>
            <h2>{t("events-title")}</h2>
          </Fade>
          <Fade right duration={1500}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "400",
                lineHeight: "1.5",
                width: "80%",
                textAlign: "center",
                opacity: "0.8",
              }}
            >
              {t("events-info")}
            </h2>
          </Fade>


          <div className="services__container">
            {Array.isArray(events) &&
              events.map((event, index) => {
                return (
                  <Zoom top duration={1700} key={event.id}>
                    <div className="container-event"
                      onClick={(e) => {
                        setVisible(true);
                        setEventDetails(event);
                      }}
                      style={{ cursor: 'pointer' }}>
                      <div className="event-img">
                        <img src={`${API_URL}/adminsEvents/${event.img}`}
                          alt="Image" />
                      </div>
                      <div className="event-txt">
                        <h3>
                          {event.title}
                        </h3>
                        <hr />
                        <p>
                          {event.content}
                        </p>
                      </div>
                      <div className="event-date">
                        <p>
                          <span>{t("from")} : </span>{event.from_date?.slice(0, 10)}
                        </p>
                        <p>
                          <span>{t("to")} : </span>{event.to_date?.slice(0, 10)}
                        </p>
                        <p>
                          <span>{t("place")} : </span>{event.place}
                        </p>
                      </div>
                    </div>
                  </Zoom>
                );
              })}
          </div>
        </section>
      )}
      <hr style={{ width: "90%", margin: "auto" }} />
      <Profit />
      <Coplaints />

      {/* <Footer /> */}
    </div>
  );
};

export default Home;
