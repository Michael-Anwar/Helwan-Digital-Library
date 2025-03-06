import { useState, useEffect } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "../../../config";
import { Link, useNavigate } from "react-router-dom";
import PopupError from "../../../components/error/PopupErrorMsg";

const ManagerReset = () => {
  const [t] = useTranslation();
  const [errors2, setErrors2] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
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
          .post(`${API_URL}/authmanager/firstlogin`, user, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.status == 200) {
              navigate("/Library/managerLOgin");
            }
          })
          .catch((err) => {
            if (err.response.status == 401) {
              window.location.replace("/Library/ManagerLogin");
            }
            if (err.response == undefined) return setErrors2("حدث خطأ ما يرجى المحاولة لاحقا");
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
    } 
    // else if (!regex.test(values.email)) {
    //   errors.email = "البريد الالكترونى غير صالح";
    // }

    if (!values.password) {
      errors.password = `${t("pass-err")}`;
    } else if (values.password.length < 7) {
      errors.password = `${t("pass-err-min")}`;
    }

    if (!values.newPassword) {
      errors.newPassword = "يرجى ادخال  كلمه المرور الجديدة";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = " يرجى اعاده ادخال كلمه المرور ";
    }

    if (values.newPassword !== values.confirmPassword) {
      errors.re_password = " كلمه المرور غير متطابقه ";
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
              <h3 style={{ marginBottom: "1rem" }}>تغير كلمه مرور الموظف</h3>
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
                    <label> البريد الالكترونى </label>
                    <input
                      style={
                        localStorage.getItem("i18nextLng") == "ar"
                          ? { direction: "rtl" }
                          : { direction: "ltr" }
                      }
                      type="text"
                      className={errors.email ? "error-in" : ""}
                      placeholder="ادخل البريد الالكترونى"
                      value={user.email}
                      onChange={(e) => {
                        setUser({ ...user, email: e.target.value });
                      }}
                    />
                    <p className="error">{errors.email}</p>
                  </div>
                  <div class="input">
                    <label>كلمه المرور</label>
                    <input
                      style={
                        localStorage.getItem("i18nextLng") == "ar"
                          ? { direction: "rtl" }
                          : { direction: "ltr" }
                      }
                      type={showPassword ? "text" : "password"}
                      className={errors.password ? "error-in" : ""}
                      placeholder=" ادخل كلمه المرور القديمه "
                      value={user.password}
                      onChange={(e) => {
                        setUser({ ...user, password: e.target.value });
                      }}
                    />
                    <p className="error">{errors.password}</p>
                  </div>
                  <div class="input">
                    <label>كلمه المرور الجديدة</label>
                    <input
                      style={
                        localStorage.getItem("i18nextLng") == "ar"
                          ? { direction: "rtl" }
                          : { direction: "ltr" }
                      }
                      type={showPassword ? "text" : "password"}
                      className={errors.newPassword ? "error-in" : ""}
                      placeholder="ادخل كلمه المرور الجديده"
                      value={user.newPassword}
                      onChange={(e) => {
                        setUser({ ...user, newPassword: e.target.value });
                      }}
                    />
                    <p className="error">{errors.newPassword}</p>
                  </div>

                  <div className="input">
                    <label> اعد ادخال كلمه المرور </label>
                    <div
                      className={`passwordcontainer ${errors.confirmPassword ? "error-in" : ""
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
                        className={errors.confirmPassword ? "error-in" : ""}
                        placeholder="ادخل كلمه المرور"
                        value={user.confirmPassword}
                        onChange={(e) => {
                          setUser({ ...user, confirmPassword: e.target.value });
                        }}
                      />
                    </div>
                    <p className="error">{errors.confirmPassword}</p>
                  </div>
                </div>

                <input type="submit" value="تسجيل الدخول" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerReset;
