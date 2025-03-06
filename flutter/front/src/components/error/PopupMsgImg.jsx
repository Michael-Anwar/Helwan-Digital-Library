import React from 'react';
import './PopupError.css';
import { useTranslation } from 'react-i18next';
import { API_URL } from "../../config";

const PopupMsgImg = ({ event, onClose }) => {


  const [t] = useTranslation();


  return (
    <div className="popup-error">
      <div className="popErrw popup-error-content">
        <div className="popup-error-message">
          {/* <div className="container-event">
            <div className="event-img">
              <img src={img} alt="Image" />
            </div>
            <div className="event-txt">
              <h3> {head} </h3>
              <hr />
              <p> {pra} </p>
            </div>
            <div className="event-date">
              <p>
                <span>{t("from")} : </span> {from}
              </p>
              <p>
                <span>{t("to")} : </span> {to}
              </p>
              <p>
                <span>{t("place")} : </span> {place}
              </p>
              </div>
          </div> */}
          <div className="container-event">
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
        </div>
        <div className="popup-error-close" onClick={onClose}>
          &#10006;
        </div>
        {/* <button className="popup-login-button" onClick={handleLogin} style={{width: '100%'}}>
        {t('Login')}
        </button> */}
      </div>
    </div>
  );
};

export default PopupMsgImg;