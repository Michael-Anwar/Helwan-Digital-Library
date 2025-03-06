import React from 'react';
import './PopupError.css';
import { useTranslation } from 'react-i18next';

const PopupErrorMsg = ({ message, onClose }) => {


  const [t] = useTranslation();

  
  return (
    <div className="popup-error">
      <div className="popup-error-content">
        <div className="popup-error-message">{message}</div>
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

export default PopupErrorMsg;