import React from "react";
import { useTranslation } from "react-i18next";
import "./landing.css";
import { useNavigate } from "react-router-dom";

import Toggle from "../../../components/togglrLang/Toggle";

const Landing = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const handleRegester = () => {
    navigate("/Library/regester");
  };
  const handleLogin = () => {
    navigate("/Library/login");
  };

  return (
    <div className="main">
      <div className="main-image">
        <img src="./assets/uni-logo.png" alt="" />
      </div>

      <div className="main-content">
        <div className="main-content-image">
          <img src="./assets/Business support-amico 1 (1).png" alt="" />
        </div>
        <div className="main-content-text">
          <h1>{t("welcome")}</h1>
        </div>
        <div className="main-content-btn" onClick={handleRegester}>
          {t("reg")}
        </div>
        <div className="main-content-btn" onClick={handleLogin}>
          {t("cont")}
        </div>
      </div>

      <div className="lang">
        <Toggle />
      </div>
    </div>
  );
};

export default Landing;
