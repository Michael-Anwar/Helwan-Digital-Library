import React, { useEffect, useState } from "react";
import "../home/home.css";
import { BiCheck } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { useTranslation } from "react-i18next";
import PopupError from "../../../components/error/PopupErrorMsg";

const AllService = () => {
  const id = "1";
  const [services, setServices] = useState([]);
  const { t } = useTranslation();
  const [error, setError] = useState();
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
  const handleCloseError = () => {
    setError("");
  };

  return (
    <div>
      {error && <PopupError message={error} onClose={handleCloseError} />}
      <section
        id="services"
        style={
          localStorage.getItem("i18nextLng") == "en"
            ? { direction: "ltr" }
            : { direction: "rtl" }
        }
      >
        <h2>{t("services-title")}</h2>
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

        <div className="services__container">
          {Array.isArray(services) &&
            services.map((service, index) => {
              if (index >= 8) {
                return null; // Skip rendering for index >= 5
              }
              return (
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
              );
            })}
        </div>
      </section>
    </div>
  );
};

export default AllService;
