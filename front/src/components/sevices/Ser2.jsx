import React, { useState, useEffect } from "react";
import { BiImageAdd } from "react-icons/bi";
import "./ser.css";
import axios from "axios";
import { API_URL } from "../../config";
import { t } from "i18next";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Serimg from "../../images/serIMG.png";
import PopupErrorMsg from "../error/PopupErrorMsg";
import PopupConfirmMsg from "../error/PopupConfirmMsg";
import { AiFillCloseCircle } from "react-icons/ai";

const Ser2 = ({ ser }) => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState({ started: false, value: 0 });
  const [confirm, setConfirm] = useState(false);
  const [disabled, setDisabled] = useState(false);
  let id2 = 0;
  let status = 0;
  if (id === undefined) {
    id = ser.service_id;
    id2 = ser.ser_formation;
    status = ser.status;
  }

  const [data, setData] = useState({
    level: "",
    photo_college_letter: "",
    service_id: id,
  });

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
    } catch (err) {
      // console.log(err);
    }

    if (status == 4) {
      try {
        axios
          .get(`${API_URL}/paymentEdit/${id}/${id2}`, { withCredentials: true })
          .then((res) => {
            setData({
              level: res.data.level,
              photo_college_letter: res.data.photo_college_letter,
            });
          })
          .catch((err) => {
            // console.log(err);
          });
      } catch (err) {
        // console.log(err);
      }
    }
  }, []);

  console.log(data);
  const handleCloseError = () => {
    setError("");
    setConfirm(false);
  };

  const handleSubmit = () => {
    if (status !== 4) {
      setConfirm(false);
      if (!data.level) {
        setError(t(`service${id}-step-two-err.level`));
        return;
      }
      if (!data.photo_college_letter) {
        setError(t(`service${id}-step-two-err.letter`));
        return;
      }

      axios.defaults.withCredentials = true;
      console.log(data);
      const formData = new FormData();
      formData.append("level", data.level);
      formData.append("photo_college_letter", data.photo_college_letter);
      formData.append("service_id", data.service_id);

      setProgress((prevState) => ({ ...prevState, started: true }));
      setMsg(t("uploading"));

      try {
        axios
          .post(`${API_URL}/payment`, formData, {
            withCredentials: true,
            onUploadProgress: (ProgressEvent) => {
              setDisabled(true);
              let percentCompleted = Math.round(
                (ProgressEvent.loaded * 100) / ProgressEvent.total
              );
              setProgress((prevState) => ({
                ...prevState,
                value: percentCompleted,
              }));
            },
          })
          .then((res) => {
            alert("done");
            navigate(`/Library`);
          })
          .catch((err) => {
            if (err.response.status == 401) {
              return window.location.replace("/Library/login");
            }
            setError(err.response.data.message[0]);
            if (
              err &&
              err.response &&
              err.response.data &&
              err.response.data[0]
            ) {
              if (
                !err.response.data[0].user &&
                err.response.data[0].user != undefined
              ) {
                return window.location.replace("/Library/login");
              }
            }
            setMsg(null);
            setProgress((prevState) => ({
              ...prevState,
              started: false,
              value: 0,
            }));
            setDisabled(false);
          });
      } catch (err) {
        // console.log(err);
        console.log(err.response.data);
        setMsg(null);
        setProgress((prevState) => ({
          ...prevState,
          started: false,
          value: 0,
        }));
        setDisabled(false);
      }
    } else if (status == 4) {
      setConfirm(false);
      if (data.level == "" && data.level !== 0) {
        setError(t(`service${id}-step-two-err.level`));
        return;
      }
      if (!data.photo_college_letter) {
        setError(t(`service${id}-step-two-err.letter`));
        return;
      }

      axios.defaults.withCredentials = true;
      console.log(data);
      const formData = new FormData();
      formData.append("level", data.level);
      if (data.photo_college_letter?.name) {
        formData.append("photo_college_letter", data.photo_college_letter);
      }

      setProgress((prevState) => ({ ...prevState, started: true }));
      setMsg(t("uploading"));

      try {
        axios
          .put(`${API_URL}/paymentedit/${id}/${id2}`, formData, {
            withCredentials: true,
            onUploadProgress: (ProgressEvent) => {
              setDisabled(true);
              let percentCompleted = Math.round(
                (ProgressEvent.loaded * 100) / ProgressEvent.total
              );
              setProgress((prevState) => ({
                ...prevState,
                value: percentCompleted,
              }));
            },
          })
          .then((res) => {
            alert("done");
            navigate(`/Library`);
          })
          .catch((err) => {
            if (err.response.status == 401) {
              return window.location.replace("/Library/login");
            }
            setError(err.response.data.message[0]);
            if (
              err &&
              err.response &&
              err.response.data &&
              err.response.data[0]
            ) {
              if (
                !err.response.data[0].user &&
                err.response.data[0].user != undefined
              ) {
                return window.location.replace("/Library/login");
              }
            }
            setMsg(null);
            setProgress((prevState) => ({
              ...prevState,
              started: false,
              value: 0,
            }));
            setDisabled(false);
          });
      } catch (err) {
        // console.log(err);
        console.log(err.response.data);
        setMsg(null);
        setProgress((prevState) => ({
          ...prevState,
          started: false,
          value: 0,
        }));
        setDisabled(false);
      }
    }
  };
  const confirmf = () => {
    setConfirm(true);
  };

  return (
    <div className="inst">
      <div
        className="req"
        style={
          localStorage.getItem("i18nextLng") == "en"
            ? { direction: "ltr" }
            : { direction: "rtl" }
        }
      >
        <div className="inst-container">
          <img src="../assets/librarylog.jpg" alt="" />
          <div className="information-service_body">
            <h1>{t("service2-name")}</h1>
            <hr style={{ width: "60%" }} />
            <img src={Serimg} alt="" className="ImageServicee" width={"50%"} />

            <div className="inputt">
              <select
                name=""
                id=""
                value={data.level}
                onChange={(e) => {
                  setData({ ...data, level: e.target.value });
                }}
              >
                <option value="">{t("level")}</option>
                <option value="0">{t("master")}</option>
                <option value="1">{t("phd")}</option>
              </select>

              <div className="select-img">
                <span className="title-upload">{t("letter")}</span>
                <label className="upload-image" htmlFor="upload-image">
                  <BiImageAdd className="img-icom" />
                  <p>{t("click-here")}</p>
                </label>
                <input
                  type="file"
                  hidden
                  id="upload-image"
                  name="upload-image"
                  onChange={(e) => {
                    setData({
                      ...data,
                      photo_college_letter: e.target.files[0],
                    });
                  }}
                />
                {data.photo_college_letter && (
                  <div>
                    <p className="upload-image value">
                      {data.photo_college_letter.name
                        ? data.photo_college_letter.name
                        : data.photo_college_letter}
                    </p>
                    <button
                      className="upload-image openPdf"
                      onClick={() => {
                        if (data.photo_college_letter.name) {
                          return window.open(
                            URL.createObjectURL(data.photo_college_letter)
                          );
                        } else {
                          return window.open(
                            `${API_URL}/${ser.national_id}/${data.photo_college_letter}`
                          );
                        }
                      }}
                    >
                      {t("open")}
                    </button>
                    <AiFillCloseCircle
                      onClick={() => {
                        setData({ ...data, photo_college_letter: "" });
                      }}
                      style={{
                        color: "#ad8700",
                        fontSize: "2rem",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {error && (
              <PopupErrorMsg message={error} onClose={handleCloseError} />
            )}

            <div className="progress">
              {progress.started && (
                <progress max="100" value={progress.value}></progress>
              )}
              {msg && <p>{msg}</p>}
            </div>
            <button disabled={disabled} onClick={confirmf} className="sub-now">
              {status !== 4 ? t("sub-now") : t("edit-btn")}
            </button>
          </div>
          {confirm && (
            <PopupConfirmMsg
              message={t("confirm-msg")}
              onClose={handleCloseError}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Ser2;
