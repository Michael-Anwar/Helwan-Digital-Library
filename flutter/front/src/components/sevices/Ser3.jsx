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

const Ser3 = ({ ser }) => {
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
  let files_numbers = "";
  if (id === undefined) {
    id = ser.service_id;
    id2 = ser.ser_personal;
    status = ser.status;
    files_numbers = ser.files_numbers;
  }
  const [data, setData] = useState({
    // photo_college_letter: "",
    files_numbers: "",
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
    // if (status == 4) {
    //   try {
    //     axios
    //       .get(`${API_URL}/paymentEdit/${id}/${id2}`, { withCredentials: true })
    //       .then((res) => {
    //         setData({
    //           photo_college_letter: res.data.photo_college_letter,
    //         });
    //       })
    //       .catch((err) => {
    //         // console.log(err);
    //       });
    //   } catch (err) {
    //     // console.log(err);
    //   }
    // }
  }, []);

  const handleCloseError = () => {
    setError("");
    setConfirm(false);
  };

  const handleSubmit = () => {
    if (status !== 4) {
      setConfirm(false);

      // if (!data.photo_college_letter) {
      //   setError(t(`service${id}-step-two-err.letter`));
      //   return;
      // }
      if (!data.files_numbers) {
        setError(t(`service${id}-step-two-err.files_numbers`));
        return;
      }
      if (data.files_numbers < 0 || data.files_numbers >= 10) {
        setError(t(`service${id}-step-two-err.files_numbers2`));
        return;
      }

      axios.defaults.withCredentials = true;
      const formData = new FormData();
      // formData.append("photo_college_letter", data.photo_college_letter);
      formData.append("files_numbers", data.files_numbers);
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
      // if (!data.photo_college_letter) {
      //   setError(t(`service${id}-step-two-err.letter`));
      //   return;
      // }
      if (!data.files_numbers) {
        setError(t(`service${id}-step-two-err.files_numbers`));
        return;
      }
      if (data.files_numbers < 0 || data.files_numbers >= 10) {
        setError(t(`service${id}-step-two-err.files_numbers2`));
        return;
      }

      axios.defaults.withCredentials = true;
      const formData = new FormData();
      formData.append("files_numbers", data.files_numbers);
      // if (data.photo_college_letter?.name) {
      //   formData.append("photo_college_letter", data.photo_college_letter);
      // }

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
          <div className="information-service">
            <img src="../assets/librarylog.jpg" alt="" />
            <div className="information-service_body">
              <h1>{t(`service${id}-name`)}</h1>
              <hr style={{ width: "60%" }} />
              <img src={Serimg} alt="" className="ImageServicee" />

              <div className="inputt" style={{ gridTemplateColumns: "1fr" }}>
                <div className="select-img">
                  {(data.files_numbers !== "" || files_numbers !== "") && (
                    <h3>{t(`service${id}-step-two.files_numbers`)}</h3>
                  )}

                  <input
                    type="number"
                    placeholder={t(`service${id}-step-two.files_numbers`)}
                    value={
                      data.files_numbers == ""
                        ? files_numbers
                        : data.files_numbers
                    }
                    onChange={(e) => {
                      setData({ ...data, files_numbers: e.target.value });
                    }}
                  />
                </div>

                {/* <div className="select-img">
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
                    <div className="text-container">
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
                </div> */}
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
              <button
                disabled={disabled}
                onClick={confirmf}
                className="sub-now"
              >
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
    </div>
  );
};

export default Ser3;
