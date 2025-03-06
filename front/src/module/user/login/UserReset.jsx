import { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "../../../config";
import { Link, useNavigate } from "react-router-dom";
import PopupError from "../../../components/error/PopupErrorMsg";
import Toggle from "../../../components/togglrLang/Toggle";

const UserReset = () => {
  const [t] = useTranslation();
  const [errors2, setErrors2] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState({
    email: "",
    national_id: "",
    newpassword: "",
    checkpassword: "",
  });

  function togglePasswordVisibility() {
    setShowPassword((prevState) => !prevState);
  }
  const handleCloseError = () => {
    setErrors2("");
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;

    if (Object.keys(errors).length === 0 && isSubmitting) {
      axios.defaults.withCredentials = true;
      try {
        axios
          .put(`${API_URL}/auth/resetpassword`, user, { withCredentials: true })
          .then((res) => {
            if (res.status == 200) {
              navigate("/Library/login");
            }
          })
          .catch((err) => {
            if (err.response == undefined) return setErrors2("حدث خطأ ما يرجى المحاولة لاحقا");
            if (err.response.status == 401) {
              return window.location.replace("/Library/login");
            }
            setErrors2(err.response.data.message[0]);
          });
      } catch (err) {
        // console.log(err);
      }
    } else {
      console.log(errors);
    }
  }, [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(user));
    setIsSubmitting(true);
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

    if (!values.email) {
      errors.email = "يرجى ادخال البريد الالكترونى";
    } else if (!regex.test(values.email)) {
      errors.email = "البريد الالكترونى غير صالح";
    }

    if (!values.national_id) {
      errors.national_id = `${t("n-id-err")}`;
    }

    if (!values.newpassword) {
      errors.newpassword = "يرجى ادخال  كلمه المرور الجديدة";
    }
    if (!values.checkpassword) {
      errors.checkpassword = " يرجى اعاده ادخال كلمه المرور ";
    }

    if (values.newpassword !== values.checkpassword) {
      errors.checkpassword = " كلمه المرور غير متطابقه ";
    }

    return errors; // Add this line to return the errors object
  };

  return (
    <div>
      <div className="main">
        {errors2 && <PopupError message={errors2} onClose={handleCloseError} />}

        <div className="main-content" style={{ boxShadow: "0 0 15px #000" }}>
          <div className="main-content-logo">
            <img src="./assets/librarylog.jpg" alt="" className="img" />
          </div>
          <div className="main-content">
            <div className="main-content-form">
              <h3 style={{ marginBottom: "1rem" }}>تسجيل الدخول</h3>
              <form onSubmit={handleSubmit}>
                <div
                  className="input-login-container"
                  style={
                    localStorage.getItem("i18nextLng") == "ar"
                      ? { direction: "rtl", textAlign: "right" }
                      : { direction: "ltr", textAlign: "left" }
                  }
                >
                  <div class="input">
                    <label>{t("n-id")}</label>
                    <input
                      style={
                        localStorage.getItem("i18nextLng") == "ar"
                          ? { direction: "rtl" }
                          : { direction: "ltr" }
                      }
                      type="text"
                      className={errors.national_id ? "error-in" : ""}
                      placeholder={t("e-n-id")}
                      value={user.national_id}
                      onChange={(e) => {
                        setUser({ ...user, national_id: e.target.value });
                      }}
                    />
                    <p className="error">{errors.national_id}</p>
                  </div>

                  <div class="input">
                    <label> {t("email")} </label>
                    <input
                      style={
                        localStorage.getItem("i18nextLng") == "ar"
                          ? { direction: "rtl" }
                          : { direction: "ltr" }
                      }
                      type="email"
                      className={errors.email ? "error-in" : ""}
                      placeholder={t("e-email")}
                      value={user.email}
                      onChange={(e) => {
                        setUser({ ...user, email: e.target.value });
                      }}
                    />
                    <p className="error">{errors.email}</p>
                  </div>

                  <div className="input">
                    <label>{t("pass")} </label>
                    <div
                      className={`passwordcontainer ${errors.newpassword ? "error-in" : ""
                        }`}
                      style={
                        localStorage.getItem("i18nextLng") == "ar"
                          ? { direction: "rtl" }
                          : { direction: "ltr" }
                      }
                    >
                      <input
                        style={
                          localStorage.getItem("i18nextLng") == "ar"
                            ? { direction: "rtl" }
                            : { direction: "ltr" }
                        }
                        type={showPassword ? "text" : "password"}
                        className={errors.newpassword ? "error-in" : ""}
                        placeholder={t("e-pass")}
                        value={user.newpassword}
                        onChange={(e) => {
                          setUser({ ...user, newpassword: e.target.value });
                        }}
                      />

                      <span onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <HiEyeOff style={{ color: "#19355a" }} />
                        ) : (
                          <HiEye style={{ color: "#19355a" }} />
                        )}
                      </span>
                    </div>
                    <p className="error">{errors.newpassword}</p>
                  </div>

                  <div className="input">
                    <label> {t("re-pass")}</label>
                    <div
                      className={`passwordcontainer ${errors.checkpassword ? "error-in" : ""
                        }`}
                      style={
                        localStorage.getItem("i18nextLng") == "ar"
                          ? { direction: "rtl" }
                          : { direction: "ltr" }
                      }
                    >
                      <input
                        style={
                          localStorage.getItem("i18nextLng") == "ar"
                            ? { direction: "rtl" }
                            : { direction: "ltr" }
                        }
                        type="password"
                        className={errors.checkpassword ? "error-in" : ""}
                        placeholder={t("e-re-pass")}
                        value={user.checkpassword}
                        onChange={(e) => {
                          setUser({ ...user, checkpassword: e.target.value });
                        }}
                      />
                    </div>
                    <p className="error">{errors.checkpassword}</p>
                  </div>
                </div>

                <input type="submit" value={t("change-pass")} />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="lang">
        <Toggle />
      </div>
    </div>
  );
};

export default UserReset;
