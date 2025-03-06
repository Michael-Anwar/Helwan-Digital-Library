import { BiSolidPrinter } from "react-icons/bi";
import "./show.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import pimg from "../../../../images/Ellipse 1.png";
import { BiImageAdd } from "react-icons/bi";
import { AiFillCloseCircle, AiOutlineDown } from "react-icons/ai";
import { API_URL } from "../../../../config";
import PopupErrorMsg from "../../../../components/error/PopupErrorMsg";
import PopupConfirmMsg from "../../../../components/error/PopupConfirmMsg";
import { BiEditAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";


const ShowA = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const pdfRef = useRef();
  const [rejRes, SetRejRes] = useState("");
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState({ started: false, value: 0 });
  const [disabled, setDisabled] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [payment_code, setPayment_code] = useState("");
  const [response_pdf, setResponse_pdf] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const [confirmE1, setConfirmE1] = useState(false);
  const [confirmE2, setConfirmE2] = useState(false);
  const [confirmA1, setConfirmA1] = useState(false);
  const [confirmA2, setConfirmA2] = useState(false);
  const [confirmR1, setConfirmR1] = useState(false);
  const [confirmR2, setConfirmR2] = useState(false);
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [confirmP, setConfirmP] = useState(false);
  const [confirmW, setConfirmW] = useState(false);
  const [confirmEA1, setConfirmEA1] = useState(false);
  const [confirmEA2, setConfirmEA2] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [confirmEdit, setConfirmEdit] = useState(false);

  const dataArray = id.split(",");
  const [response, setResponse] = useState({
    response_text: "",
    response_pdf: "",
  });
  const [action, setAction] = useState({
    status: 0,
    column: "",
    reason: "",
    student_id: "",
    ser_id: "",
    ser_name: "",
    app_id: "",
  });

  const [data, SetData] = useState({
    student_id: dataArray[0],
    ser_id: dataArray[1],
    ser_name: dataArray[2],
    app_id: dataArray[3],
  });

  const navigate = useNavigate();
  const [user, setUser] = useState({});
  axios.defaults.withCredentials = true;
  useEffect(() => {
    try {
      axios
        .get(
          `${API_URL}/user/getuserbyid/${data.ser_id}/${data.ser_name}/${data.student_id}/${data.app_id}`,
          { withCredentials: true }
        )
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          if (error.response.status == 401) window.location.replace("/Library/ManagerLogin");
          window.location.replace("/Library/ManagerLogin");
        });
      axios.get(`${API_URL}/user/getAllFaculties`)
        .then((res) => {
          setFaculty(res.data);
        })
        .catch((err) => {
          window.location.replace("/Library/ManagerLogin");
        });
    } catch (error) {
      window.location.replace("/Library/ManagerLogin");
    }
  }, []);
  const openImage = (url) => {
    const filename = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.target = "_blank";
    aTag.click();
    aTag.remove();
  };
  const downloadImage = (url, filename) => {
    saveAs(url, filename);
  };

  // const downloadPDF = () => {
  //   const inpput = pdfRef.current;
  //   html2canvas(inpput).then((canvas) => {
  //     const imgData = canvas.toDataURL(
  //       "image/png" ||
  //       "image/jpg" ||
  //       "image/svg" ||
  //       "image/gif" ||
  //       "image/jpeg" ||
  //       "image/webp"
  //     );
  //     const pdf = new jspdf("l", "pc", "a4", true);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgwidth = canvas.width;
  //     const imgheight = canvas.height;
  //     const ratio =
  //       imgwidth / imgheight >= pdfWidth / pdfHeight
  //         ? pdfWidth / imgwidth
  //         : pdfHeight / imgheight;
  //     const imgx = (pdfWidth - imgwidth * ratio) / 2;
  //     const imgy = (pdfHeight - imgheight * ratio) / 2;
  //     pdf.addImage(
  //       imgData,
  //       "jpg",
  //       imgx,
  //       imgy,
  //       imgwidth * ratio,
  //       imgheight * ratio
  //     );
  //     pdf.save("download.pdf");
  //   });
  // };

  const [errors, setErrors] = useState();

  // const increaseDateByOneDay = (date) => {
  //   const currentDate = new Date(date);
  //   currentDate.setDate(currentDate.getDate() + 1);
  //   return currentDate.toISOString().slice(0, 10);
  // };

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
  const handleCloseError = () => {
    setErrors("");
    setConfirm(false);
    setConfirmA1(false);
    setConfirmA2(false);
    setConfirmR1(false);
    setConfirmR2(false);
    setConfirmE1(false);
    setConfirmE2(false);
    setConfirmReturn(false);
    setConfirmP(false);
    setConfirmW(false);
    setConfirmEdit(false);
    setConfirmEA1(false);
    setConfirmEA2(false);
  };

  const handelAccept = () => {
    if (response.response_text !== "") {
      const formData = new FormData();
      setErrors("");
      axios.defaults.withCredentials = true;
      try {
        formData.append("response_text", response.response_text);
        formData.append("response_pdf", response.response_pdf);
        formData.append("student_id", data.student_id);
        formData.append("ser_id", data.ser_id);
        formData.append("ser_name", data.ser_name);
        formData.append("app_id", data.app_id);
        formData.append("national_id", user.national_id);

        axios
          .put(
            `${API_URL}/manager/acceptApplicant/${user.national_id}`,
            formData,
            {
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
            }
          )
          .then((res) => {
            setProgress((prevState) => ({ ...prevState, started: false }));
            setMsg(res.data.msg);
            window.location.reload();
          })
          .catch((error) => {
            setDisabled(false);
            setProgress((prevState) => ({ ...prevState, started: false }));
            if (error.response.status == 401) window.location.replace("/Library/ManagerLogin");
            else if (error.response.status == 400)
              setErrors(error.response.data.message);
            else setErrors("حدث خطأ ما");
          });
      } catch (error) {
        setDisabled(false);
        setProgress((prevState) => ({ ...prevState, started: false }));
        setErrors("حدث خطأ ما");
      }
    } else {
      setErrors("يجب ادخال الرد");
    }
  };
  const handelAcceptpayment = () => {
    if (payment_code !== "") {
      // if (isNaN(payment_code)) {
      //   setErrors("كود الدفع يجب ان يكون رقم");
      //   return;
      // }
      const formData = new FormData();
      setErrors("");
      axios.defaults.withCredentials = true;
      try {
        formData.append("payment_code", payment_code);
        formData.append("student_id", data.student_id);
        formData.append("ser_id", data.ser_id);
        formData.append("ser_name", data.ser_name);
        formData.append("app_id", data.app_id);

        axios
          .put(`${API_URL}/manager/Sendpayment`, formData, {
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
            setProgress((prevState) => ({ ...prevState, started: false }));
            setMsg(res.data.msg);
            navigate("/Library/manager");
          })
          .catch((error) => {
            setDisabled(false);
            setProgress((prevState) => ({ ...prevState, started: false }));
            if (error.response.status == 401) navigate("/Library/ManagerLogin");
            else if (error.response.status == 400)
              setErrors(error.response.data.message);
            else setErrors("حدث خطأ ما");
          });
      } catch (error) {
        setDisabled(false);
        setProgress((prevState) => ({ ...prevState, started: false }));
        setErrors("حدث خطأ ما");
      }
    } else {
      setErrors("يجب ادخال الرد");
    }
  };

  const handleEdit = () => {
    if (action.reason !== "") {
      try {
        const updatedAction = {
          ...action,
          student_id: dataArray[0],
          ser_id: dataArray[1],
          ser_name: dataArray[2],
          app_id: dataArray[3],
        };

        if (
          +user.role === 1 &&
          (+updatedAction.ser_id !== 8 || +updatedAction.ser_id !== 7)
        ) {
          updatedAction.column = "manager_status";
          updatedAction.status = 3;
        } else if (
          +user.role === 2 &&
          (+updatedAction.ser_id !== 8 || +updatedAction.ser_id !== 7)
        ) {
          updatedAction.column = "status";
          updatedAction.status = 3;
          updatedAction.role = 2;
        } else if (
          +user.role === 1 &&
          (+updatedAction.ser_id == 8 || +updatedAction.ser_id == 7)
        ) {
          updatedAction.column = "manager_status";
          updatedAction.status = 4;
          updatedAction.role = 2;
        } else if (
          +user.role === 2 &&
          (+updatedAction.ser_id == 8 || +updatedAction.ser_id == 7)
        ) {
          updatedAction.column = "status";
          updatedAction.status = 4;
          updatedAction.role = 2;
        }

        if (+user.status === 0) {
          updatedAction.column = "status";
          updatedAction.status = 4;
        }

        setAction(updatedAction);
        setConfirm(true);
        axios.defaults.withCredentials = true;

        axios
          .put(`${API_URL}/manager/acceptApplicantforManager`, updatedAction, {
            withCredentials: true,
          })
          .then((res) => {
            navigate("/Library/manager");
          })
          .catch((error) => {
            setDisabled(false);
            if (error.response && error.response.status === 401) {
              // Unauthorized, navigate to the login page
              navigate("/Library/ManagerLogin");
            } else if (error.response && error.response.status === 400) {
              // Bad request, set the error message
              setErrors(error.response.data.msg);
            } else {
              // Other errors, set a generic error message
              setErrors("حدث خطأ ما");
            }
          });
      } catch (error) {
        setDisabled(false);
        setErrors("حدث خطأ ما");
      }
    } else {
      setErrors("يجب ادخال سبب");
    }
  };
  const handleEditPayment = () => {
    if (action.reason !== "") {
      try {
        const updatedAction = {
          ...action,
          student_id: dataArray[0],
          ser_id: dataArray[1],
          ser_name: dataArray[2],
          app_id: dataArray[3],
        };

        if (
          +user.role === 1 &&
          (+updatedAction.ser_id !== 8 || +updatedAction.ser_id !== 7)
        ) {
          updatedAction.column = "manager_status";
          updatedAction.status = 4;
        } else if (
          +user.role === 2 &&
          (+updatedAction.ser_id !== 8 || +updatedAction.ser_id !== 7)
        ) {
          updatedAction.column = "status";
          updatedAction.status = 4;
          updatedAction.role = 2;
        }


        setAction(updatedAction);
        setConfirm(true);
        axios.defaults.withCredentials = true;

        axios
          .put(`${API_URL}/manager/acceptApplicantforManager`, updatedAction, {
            withCredentials: true,
          })
          .then((res) => {
            navigate("/Library/manager");
          })
          .catch((error) => {
            setDisabled(false);
            if (error.response && error.response.status === 401) {
              // Unauthorized, navigate to the login page
              navigate("/Library/ManagerLogin");
            } else if (error.response && error.response.status === 400) {
              // Bad request, set the error message
              setErrors(error.response.data.msg);
            } else {
              // Other errors, set a generic error message
              setErrors("حدث خطأ ما");
            }
          });
      } catch (error) {
        setDisabled(false);
        setErrors("حدث خطأ ما");
      }
    } else {
      setErrors("يجب ادخال سبب");
    }
  };
  const handelrej = () => {
    if (action.reason !== "") {
      try {
        const updatedAction = {
          ...action,
          student_id: dataArray[0],
          ser_id: dataArray[1],
          ser_name: dataArray[2],
          app_id: dataArray[3],
          response_date: ''
        };

        if (user.role === 1) {
          updatedAction.column = "manager_status";
          updatedAction.status = 2;
        } else if (user.role === 2 || user.status === 0) {
          updatedAction.column = "status";
          updatedAction.status = 6;
          updatedAction.role = 2;
          updatedAction.response_date = new Date()
        }

        setAction(updatedAction);
        setConfirm(true);
        axios.defaults.withCredentials = true;

        axios
          .put(`${API_URL}/manager/acceptApplicantforManager`, updatedAction, {
            withCredentials: true,
          })
          .then((res) => {
            navigate("/Library/manager");
          })
          .catch((error) => {
            setDisabled(false);
            if (error.response && error.response.status === 401) {
              navigate("/Library/ManagerLogin");
            } else if (error.response && error.response.status === 400) {
              setErrors(error.response.data.msg);
            } else {
              setErrors("حدث خطأ ما");
            }
          });
      } catch (error) {
        setDisabled(false);
        setErrors("حدث خطأ ما");
      }
    } else {
      setErrors("يجب ادخال سبب");
    }
  };

  const handelEdit2 = () => {
    try {
      const updatedAction = {
        ...action,
        column: "status",
        student_id: dataArray[0],
        ser_id: dataArray[1],
        ser_name: dataArray[2],
        app_id: dataArray[3],
      };

      if (
        +updatedAction.ser_id == 8 ||
        +updatedAction.ser_id == 7 ||
        +user.status === 0
      ) {
        updatedAction.status = 3;
      } else if (
        +updatedAction.ser_id !== 8 ||
        +updatedAction.ser_id !== 7 ||
        +user.status === 0
      ) {
        updatedAction.status = 3;
      }

      setAction(updatedAction);
      setConfirm(true);
      axios.defaults.withCredentials = true;

      axios
        .put(`${API_URL}/manager/acceptApplicantforManager`, updatedAction, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setDisabled(true);
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress((prevState) => ({
              ...prevState,
              value: percentCompleted,
            }));
          },
        })
        .then((res) => {
          setProgress((prevState) => ({ ...prevState, started: false }));
          setMsg(res.data.msg);
          navigate("/Library/manager");
        })
        .catch((error) => {
          setDisabled(false);
          setErrors(error.response.data.message);
          console.log(error.response.data.message);
          setProgress((prevState) => ({ ...prevState, started: false }));
          if (error.response && error.response.status === 401) {
            navigate("/Library/ManagerLogin");
          } else if (error.response && error.response.status === 400) {
            setErrors(error.response.data.message);
          } else {
            setErrors("حدث خطأ ما");
          }
        });
    } catch (error) {
      setDisabled(false);
      setProgress((prevState) => ({ ...prevState, started: false }));
      setErrors("حدث خطأ ما");
    }
  };
  const handleEditPayment2 = () => {
    try {
      const updatedAction = {
        ...action,
        column: "status",
        student_id: dataArray[0],
        ser_id: dataArray[1],
        ser_name: dataArray[2],
        app_id: dataArray[3],
      };

      if (
        +updatedAction.ser_id == 8 ||
        +updatedAction.ser_id == 7 ||
        +user.status === 0
      ) {
        updatedAction.status = 4;
      } else if (
        +updatedAction.ser_id !== 8 ||
        +updatedAction.ser_id !== 7 ||
        +user.status === 0
      ) {
        updatedAction.status = 4;
      }

      setAction(updatedAction);
      setConfirm(true);
      axios.defaults.withCredentials = true;

      axios
        .put(`${API_URL}/manager/acceptApplicantforManager`, updatedAction, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setDisabled(true);
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress((prevState) => ({
              ...prevState,
              value: percentCompleted,
            }));
          },
        })
        .then((res) => {
          setProgress((prevState) => ({ ...prevState, started: false }));
          setMsg(res.data.msg);
          navigate("/Library/manager");
        })
        .catch((error) => {
          setDisabled(false);
          setErrors(error.response.data.message);
          console.log(error.response.data.message);
          setProgress((prevState) => ({ ...prevState, started: false }));
          if (error.response && error.response.status === 401) {
            navigate("/Library/ManagerLogin");
          } else if (error.response && error.response.status === 400) {
            setErrors(error.response.data.message);
          } else {
            setErrors("حدث خطأ ما");
          }
        });
    } catch (error) {
      setDisabled(false);
      setProgress((prevState) => ({ ...prevState, started: false }));
      setErrors("حدث خطأ ما");
    }
  };
  const handelrej2 = () => {
    try {
      const updatedAction = {
        ...action,
        status: 6,
        column: "status",
        student_id: dataArray[0],
        ser_id: dataArray[1],
        ser_name: dataArray[2],
        app_id: dataArray[3],
      };

      setAction(updatedAction);
      setConfirm(true);
      axios.defaults.withCredentials = true;

      axios
        .put(`${API_URL}/manager/acceptApplicantforManager`, updatedAction, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setDisabled(true);
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress((prevState) => ({
              ...prevState,
              value: percentCompleted,
            }));
          },
        })
        .then((res) => {
          setProgress((prevState) => ({ ...prevState, started: false }));
          setMsg(res.data.msg);
          navigate("/Library/manager/reviewed");
        })
        .catch((error) => {
          setDisabled(false);
          setProgress((prevState) => ({ ...prevState, started: false }));
          if (error.response && error.response.status === 401) {
            navigate("/Library/ManagerLogin");
          } else if (error.response && error.response.status === 400) {
            setErrors(error.response.data.message);
          } else {
            setErrors("حدث خطأ ما");
          }
        });
    } catch (error) {
      setDisabled(false);
      setProgress((prevState) => ({ ...prevState, started: false }));
      setErrors("حدث خطأ ما");
    }
  };
  const handelAccept2 = () => {
    try {
      if ((user.response_pdf !== null && user.response_pdf !== "") && (response_pdf === null || response_pdf === "")) {
        setErrors("يجب اضافه التقرير / الافاده pdf");
        return;
      }

      // validate the response pdf file
      if (response_pdf != "") {
        const allowedExtensions = /(\.pdf)$/i;
        if (!allowedExtensions.exec(response_pdf.name)) {
          setErrors("يجب ان يكون ملف pdf");
          return;
        }
      }

      const formData = new FormData();
      const updatedAction = {
        ...action,
        status: 5,
        column: "status",
        student_id: dataArray[0],
        ser_id: dataArray[1],
        ser_name: dataArray[2],
        app_id: dataArray[3],
      };
      if ((user.response_pdf !== null || user.response_pdf !== "") && response_pdf !== "") {
        updatedAction.response_pdf = response_pdf;
        formData.append("response_pdf", response_pdf);
        formData.append("status", 5);
        formData.append("column", "status");
        formData.append("student_id", dataArray[0]);
        formData.append("ser_id", dataArray[1]);
        formData.append("ser_name", dataArray[2]);
        formData.append("app_id", dataArray[3]);

        axios.defaults.withCredentials = true;
        axios.put(`${API_URL}/manager/acceptApplicantforManagerWithpdf/${user.national_id}`, formData, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setDisabled(true);
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress((prevState) => ({
              ...prevState,
              value: percentCompleted,
            }));
          },
        })
          .then((res) => {
            setProgress((prevState) => ({ ...prevState, started: false }));
            window.location.reload();
          })
          .catch((error) => {
            setDisabled(false);
            setProgress((prevState) => ({ ...prevState, started: false }));
            if (error.response && error.response.status === 401) {
              navigate("/Library/ManagerLogin");
            } else if (error.response && error.response.status === 400) {
              setErrors(error.response.data.message);
            } else {
              setErrors("حدث خطأ ما");
            }
          });
      } else {

        setAction(updatedAction);
        setConfirm(true);
        axios.defaults.withCredentials = true;

        axios
          .put(`${API_URL}/manager/acceptApplicantforManager`, updatedAction, {
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              setDisabled(true);
              let percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress((prevState) => ({
                ...prevState,
                value: percentCompleted,
              }));
            },
          })
          .then((res) => {
            setProgress((prevState) => ({ ...prevState, started: false }));
            setMsg(res.data.msg);
            navigate("/Library/manager/reviewed");
          })
          .catch((error) => {
            setDisabled(false);
            setProgress((prevState) => ({ ...prevState, started: false }));
            if (error.response && error.response.status === 401) {
              navigate("/Library/ManagerLogin");
            } else if (error.response && error.response.status === 400) {
              setErrors(error.response.data.message);
            } else {
              setErrors("حدث خطأ ما");
            }
          });
      }
    } catch (error) {
      setDisabled(false);
      setProgress((prevState) => ({ ...prevState, started: false }));
      setErrors("حدث خطأ ما");
    }
  };
  const handleReturn = () => {
    try {
      const updatedAction = {
        ...action,
        status: null,
        column: "manager_status",
        student_id: dataArray[0],
        ser_id: dataArray[1],
        ser_name: dataArray[2],
        app_id: dataArray[3],
        reason: null,
      };

      setAction(updatedAction);
      setConfirm(true);
      axios.defaults.withCredentials = true;

      axios
        .put(`${API_URL}/manager/acceptApplicantforManager`, updatedAction, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setDisabled(true);
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress((prevState) => ({
              ...prevState,
              value: percentCompleted,
            }));
          },
        })
        .then((res) => {
          setProgress((prevState) => ({ ...prevState, started: false }));
          setMsg(res.data.msg);
          navigate("/Library/manager");
        })
        .catch((error) => {
          setDisabled(false);
          setProgress((prevState) => ({ ...prevState, started: false }));
          if (error.response && error.response.status === 401) {
            navigate("/Library/ManagerLogin");
          } else if (error.response && error.response.status === 400) {
            setErrors(error.response.data.message);
          } else {
            setErrors("حدث خطأ ما");
          }
        });
    } catch (error) {
      setDisabled(false);
      setProgress((prevState) => ({ ...prevState, started: false }));
      setErrors("حدث خطأ ما");
    }
  };
  const handewait = () => {
    try {
      const updatedAction = {
        ...action,
        student_id: dataArray[0],
        ser_id: dataArray[1],
        ser_name: dataArray[2],
        app_id: dataArray[3],
        status: 2,
      };

      setAction(updatedAction);
      setConfirm(true);
      axios.defaults.withCredentials = true;

      axios
        .put(
          `${API_URL}/manager/watingApplicant/${user.national_id}`,
          updatedAction,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          navigate("/Library/manager");
        })
        .catch((error) => {
          setDisabled(false);
          if (error.response && error.response.status === 401) {
            navigate("/Library/ManagerLogin");
          } else if (error.response && error.response.status === 400) {
            setErrors(error.response.data.msg);
          } else {
            setErrors("حدث خطأ ما");
          }
        });
    } catch (error) {
      setDisabled(false);
      setErrors("حدث خطأ ما");
    }
  };

  const handleEditUser = () => {
    setDisabled(true);
    try {
      axios.defaults.withCredentials = true;
      axios.put(`${API_URL}/user/updateuserManager`, user, { withCredentials: true })
        .then((res) => {
          window.location.reload();
        })
        .catch((error) => {
          setDisabled(false);
          if (error.response && error.response.status === 401) {
            navigate("/Library/ManagerLogin");
          } else if (error.response && error.response.status === 400) {
            setErrors(error.response?.data?.errors[0]?.message);
          } else {
            setErrors("حدث خطأ ما");
          }
        });
    } catch (error) {
      setDisabled(false);
      setErrors("حدث خطأ ما");
    }


  }



  // const userResponseText = (text) => {
  //   let response_text;
  //   console.log(text);
  //   try {
  //     const parsedResponse = JSON.parse(text);
  //     console.log(parsedResponse);
  //     response_text = typeof parsedResponse === "object"
  //       ? Object.entries(parsedResponse).map(([key, value], index, array) => {
  //         if (index !== array.length - 1) { // Check if it's not the last index
  //           return (
  //             <div key={key} className="response-text">
  //               <h2>{value.detail}</h2>
  //               <h2>{format(value.date)}</h2>
  //             </div>
  //           );
  //         }
  //         return null; // Return null for the last index
  //       })
  //       : parsedResponse;
  //   } catch (error) {
  //     response_text = text;
  //   }
  //   return response_text;
  // };

  // const getLastReason = (text) => {
  //   let lastReasonDetail = null;
  //   try {
  //     const parsedResponse = JSON.parse(text);
  //     if (typeof parsedResponse === "object") {
  //       const lastReason = Object.entries(parsedResponse).pop();
  //       lastReasonDetail = lastReason[1].detail;
  //     }
  //   } catch (error) {
  //     lastReasonDetail = text;
  //   }
  //   return lastReasonDetail;
  // }


  const getUpdatedHistory = (historyJsonString) => {
    try {
      const historyObj = historyJsonString;
      // Check if the parsed value is an object
      if (typeof historyObj === 'object' && historyObj !== null) {
        // Convert the object into an array of React elements
        const historyElements = Object.keys(historyObj).map((reasonKey) => (
          <div key={reasonKey} className="history-item">
            <span className="detail"> {historyObj[reasonKey].detail}</span>
            <span className="date"> {format(historyObj[reasonKey].date)}</span>
          </div>
        ));
  
        // Return the array of React elements
        return (
          <div className="history-list">
            {historyElements}
          </div>
        );
      } else {
        // Handle the case when the parsed value is not an object
        return null;
      }
    } catch (error) {
      // Handle JSON parsing error
      console.error('Error parsing JSON:', error);
      return null;
    }
  };
  

  return (
    <>

      {confirmEA1 && (
        <PopupConfirmMsg
          message={"تأكيد طلب التعديل"}
          onClose={handleCloseError}
          onSubmit={handleEditPayment}
        />
      )}
      {confirmEA2 && (
        <PopupConfirmMsg
          message={"تأكيد طلب التعديل"}
          onClose={handleCloseError}
          onSubmit={handleEditPayment2}
        />
      )}
      {confirmE1 && (
        <PopupConfirmMsg
          message={"تأكيد طلب التعديل"}
          onClose={handleCloseError}
          onSubmit={handleEdit}
        />
      )}
      {confirmR1 && (
        <PopupConfirmMsg
          message={"تأكيد الرفض"}
          onClose={handleCloseError}
          onSubmit={handelrej}
        />
      )}
      {confirmA1 && (
        <PopupConfirmMsg
          message={"تأكيد القبول"}
          onClose={handleCloseError}
          onSubmit={handelAccept}
        />
      )}
      {confirmE2 && (
        <PopupConfirmMsg
          message={"تأكيد طلب التعديل"}
          onClose={handleCloseError}
          onSubmit={handelEdit2}
        />
      )}
      {confirmReturn && (
        <PopupConfirmMsg
          message={"تأكيد الرجوع للمراجعه"}
          onClose={handleCloseError}
          onSubmit={handleReturn}
        />
      )}
      {confirmA2 && (
        <PopupConfirmMsg
          message={"تأكيد القبول"}
          onClose={handleCloseError}
          onSubmit={handelAccept2}
        />
      )}
      {confirmR2 && (
        <PopupConfirmMsg
          message={"تأكيد الرفض"}
          onClose={handleCloseError}
          onSubmit={handelrej2}
        />
      )}
      {confirmP && (
        <PopupConfirmMsg
          message={"تأكيد ارسال كود الدفع"}
          onClose={handleCloseError}
          onSubmit={handelAcceptpayment}
        />
      )}
      {confirmW && (
        <PopupConfirmMsg
          message={"تأكيد العوده لقائمه الانتظار"}
          onClose={handleCloseError}
          onSubmit={handewait}
        />
      )}
      {confirmEdit && (
        <PopupConfirmMsg
          message={"تأكيد تعديل بيانات الطالب"}
          onClose={handleCloseError}
          onSubmit={handleEditUser}
        />
      )}
      <section className="cotainer-data">
        {/* <div className="navv" style={{ justifyContent: "center" }}>
          <h2 style={{  fontSize: "2rem" , fontWeight: "bold" }}>
            بيانات الطالب</h2>
          <button onClick={downloadPDF} className="wait-edit">
            <BiSolidPrinter />
            طباعه
          </button> 
        </div>
        <hr /> */}
        <div className="data-container" ref={pdfRef}>
          <div className="image-con">
            <img src={user.img ? `${API_URL}/${user.national_id}/${user.img}` : pimg}
              alt="img"
              className="imagee"
            />
            {user.manager_status == 1 && user.status !== 5 ? (
              <div className="status">
                <h2> تأكيد قبول الطلب </h2>
                {(user.response_pdf !== null || user.response_pdf !== "") && (
                  <div className="select-img">
                    <label className="upload-image" htmlFor="upload-image">
                      <BiImageAdd className="img-icom" />
                      <p> اضغط هنا لاضافه التقرير / الافاده </p>
                    </label>
                    <input
                      type="file"
                      hidden
                      id="upload-image"
                      name="upload-image"
                      onChange={(e) => {
                        setResponse_pdf(e.target.files[0]);
                      }}
                    />
                    {response_pdf && (
                      <div>
                        <p className="upload-image value">
                          {response_pdf.name
                            ? response_pdf.name
                            : null}
                        </p>
                        <button
                          className="upload-image openPdf"
                          onClick={() => {
                            window.open(
                              URL.createObjectURL(response_pdf)
                            );
                          }}
                        >
                          {t("open")}
                        </button>
                        <AiFillCloseCircle
                          onClick={() => {
                            setResponse_pdf("");
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
                )}
                <div className="atch-btns">
                  <button
                    onClick={() => {
                      setConfirmA2(true);
                    }}
                    className="atch-btn"
                  >
                    تأكيد
                  </button>

                  <button
                    onClick={() => {
                      setConfirmReturn(true);
                    }}
                    className="atch-btn atch-btn2"
                  >
                    يعود للمراجعه مره اخري
                  </button>
                </div>
              </div>
            ) : (user.manager_status == 1 && user.status == 5) ||
              (user.manager_status == null && user.status == 5) ? (
              <div className="status">
                <p style={{ background: "rgb(35, 175, 110)" }}>
                  تم قبول الطلب
                </p>
                <p style={{ background: "rgb(35, 175, 110)" }}>
                  {user.response_text}
                </p>

                <input
                  disabled={disabled}
                  type="text"
                  placeholder="سبب التعديل"
                  className="edit-input"
                  onChange={(e) => {
                    setAction({ ...action, reason: e.target.value });
                  }}
                />
                <button
                  onClick={() => {
                    setConfirmE1(true);
                  }}
                  className="wait-edit"
                >
                  طلب تعديل البيانات
                </button>
                <hr style={{ width: "80%", height: "3px" }} />
                <button
                  onClick={() => {
                    setConfirmW(true);
                  }}
                  className="wait-edit"
                >
                  عوده لقائمه الانتظار للمراجعه
                </button>

              </div>

            ) : null}
            {user.manager_status == null &&
              (user.status == 2 || user.status == 0) ? (
              <div className="status">
                <input
                  disabled={disabled}
                  type="text"
                  placeholder="سبب التعديل"
                  className="edit-input"
                  onChange={(e) => {
                    setAction({ ...action, reason: e.target.value });
                  }}
                />
                <button
                  onClick={() => {
                    setConfirmE1(true);
                  }}
                  className="wait-edit"
                >
                  طلب تعديل البيانات
                </button>
                <hr style={{ width: "80%", height: "3px" }} />
                <input
                  disabled={disabled}
                  type="text"
                  placeholder="سبب التعديل"
                  className="edit-input"
                  onChange={(e) => {
                    setAction({ ...action, reason: e.target.value });
                  }}
                />
                {user.status == 2 && (user.service_id == 1 || user.service_id == 2 || user.service_id == 4 || user.service_id == 5 || user.service_id == 6) ? (
                  <>
                    <button
                      onClick={() => {
                        setConfirmEA1(true);
                      }}
                      className="wait-edit"
                    >
                      طلب تعديل بيانات المرسله لكود الدفع
                    </button>
                    <hr style={{ width: "80%", height: "3px" }} />

                    <input
                      disabled={disabled}
                      type="text"
                      placeholder="سبب الرفض"
                      style={{ border: "2px solid rgb(175, 35, 35)" }}
                      className="rej-input"
                      onChange={(e) => {
                        setAction({ ...action, reason: e.target.value });
                      }}
                    />
                  </>
                ) : null}

                <button
                  onClick={() => {
                    setConfirmR1(true);
                  }}
                  className="ref"
                >
                  رفض
                </button>
              </div>
            ) : user.manager_status == 3 && (user.status == 2 || user.status == 5 || user.status == 6) ? (
              <div className="status">
                <h2> تأكيد تعديل الطلب </h2>
                <div className="atch-btns">
                  <button
                    onClick={() => {
                      setConfirmE2(true);
                    }}
                    className="atch-btn"
                  >
                    تأكيد
                  </button>
                  <button
                    onClick={() => {
                      setConfirmReturn(true);
                    }}
                    className="atch-btn atch-btn2"
                  >
                    يعود للمراجعه مره اخري
                  </button>
                </div>
              </div>
            ) : user.manager_status == 4 && (user.status == 2 || user.status == 5 || user.status == 6) ? (
              <div className="status">
                <h2> تأكيد عوده الطلب لتعديل البيانات المرفقه لكود الدفع </h2>
                <div className="atch-btns">
                  <button
                    onClick={() => {
                      setConfirmEA2(true);
                    }}
                    className="atch-btn"
                  >
                    تأكيد
                  </button>
                  <button
                    onClick={() => {
                      setConfirmReturn(true);
                    }}
                    className="atch-btn atch-btn2"
                  >
                    يعود للمراجعه مره اخري
                  </button>
                </div>
              </div>
            ) : (user.manager_status == 3 && user.status == 3) ||
              (user.manager_status == null &&
                (user.status == 3 || user.status == 4)) ? (
              <div className="status">
                <p style={{ background: "rgb(0, 60, 112)" }}> سبب التعديل </p>
                <p style={{ background: "rgb(0, 60, 112)" }}>
                  {user.response_text}
                </p>
                <button
                  onClick={() => {
                    setConfirmW(true);
                  }}
                  style={{ background: "#ad8700", color: "white", border: "#ad8700" }}
                  className="wait-edit"
                >
                  عوده لقائمه الانتظار للمراجعه
                </button>
                
              </div>
            ) : null}
            {user.manager_status == 2 && user.status == 2 ? (
              <div className="status">
                <h2 style={{ color: "rgb(175, 35, 35)" }}> تأكيد رفض الطلب </h2>
                <div className="atch-btns">
                  <button
                    onClick={() => {
                      setConfirmR2(true);
                    }}
                    className="atch-btn"
                  >
                    تأكيد
                  </button>
                  <button
                    onClick={() => {
                      setConfirmReturn(true);
                    }}
                    className="atch-btn atch-btn2"
                  >
                    يعود للمراجعه مره اخري
                  </button>
                </div>
              </div>
            ) : (user.manager_status == 2 && user.status == 6) ||
              (user.manager_status == null && user.status == 6) ? (
              <div className="status">
                <p style={{ background: "rgb(175, 35, 35)" }}> سبب الرفض </p>
                <p style={{ background: "rgb(175, 35, 35)" }}>
                  {user.response_text}
                </p>
                <input
                  disabled={disabled}
                  type="text"
                  placeholder="سبب التعديل"
                  className="edit-input"
                  onChange={(e) => {
                    setAction({ ...action, reason: e.target.value });
                  }}
                />
                <button
                  onClick={() => {
                    setConfirmE1(true);
                  }}
                  className="wait-edit"
                >
                  طلب تعديل البيانات
                </button>
                <hr style={{ width: "80%", height: "3px" }} />
                <button
                  onClick={() => {
                    setConfirmW(true);
                  }}
                  className="wait-edit"
                >
                  عوده لقائمه الانتظار للمراجعه
                </button>

              </div>
            ) : null}
          </div>

          <div className="data-con-table-btn">
            <table className="data-table" style={{ direction: "rtl" }}>
              <tr>
                <th> معلومات اساسيه </th>
                <th> البيانات </th>
              </tr>

              <tr>
                <td>الاسم</td>
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.name}
                    onChange={(e) => {
                      setUser({ ...user, name: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>الجنسيه</td>
                {/* <td>{user.nationality}</td> */}
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.nationality}
                    onChange={(e) => {
                      setUser({ ...user, nationality: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>البريد الالكترونى</td>
                {/* <td>{user.email}</td> */}
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.email}
                    onChange={(e) => {
                      setUser({ ...user, email: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>رقم الهاتف</td>
                {/* <td>{user.phone}</td> */}
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.phone}
                    onChange={(e) => {
                      setUser({ ...user, phone: e.target.value });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>الرقم القومى</td>
                <td>{user.national_id}</td>
              </tr>
              <tr>
                <td>الجامعه</td>
                <td>
                  {+user.university === 1 ? "جامعه حلوان" : user.university}
                </td>
                {/* {+user.university !== 1 ? (
                  <td>
                    <input
                      className="edit-input-user"
                      type="text"
                      value={user.university}
                      onChange={(e) => {
                        setUser({ ...user, university: e.target.value });
                      }}
                    />

                  </td>
                ) :
                  <td>
                    <select
                      className="edit-input-user"
                      value={user.university}
                      onChange={(e) => {
                        setUser({ ...user, university: e.target.value });
                      }}
                    >
                      <option value="1">{t("helwan-uni")} </option>
                      <option value="0">{t("other-uni")} </option>
                    </select>
                  </td>
                } */}
              </tr>
              {/* {user.university !== 1 && (
                <tr>
                  <td>الكليه</td>
                  <td>
                    <input
                      className="edit-input-user"
                      type="text"
                      value={user.faculity != null ? user.faculity : null}
                      placeholder=" ادخل اسم الكليه"
                      onChange={(e) => {
                        setUser({ ...user, faculity: e.target.value, faculity_id: null });
                      }}
                    />
                  </td>
                </tr>
              )}
              {user.university == 1 && (
                <tr>
                  <td>الكليه</td>
                  <td>
                    <select
                      className="edit-input-user"
                      value={user.faculity_id}
                      onChange={(e) => {
                        setUser({ ...user, faculity_id: e.target.value, faculity: null });
                      }}
                    >
                      <option value=""> اختر الكليه </option>
                      {faculty?.map((faculty) => (
                        <option value={faculty.faculty_id}>
                          {faculty.faculty_name_ar}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )} */}
              <tr>
                <td>الكليه</td>
                <td>{user.faculty_name_ar ? user.faculty_name_ar : user.faculity}</td>
              </tr>
              <tr>
                <td>القسم</td>
                {/* <td>{user.department}</td> */}
                <td>
                  <input
                    className="edit-input-user"
                    type="text"
                    value={user.department}
                    onChange={(e) => {
                      setUser({ ...user, department: e.target.value });
                    }}
                  />
                </td>
              </tr>
              {(user.level !== null || user.level !== undefined || user.level !== "") && (
                <tr>
                  <td> المرحله </td>
                  <td>
                    {user.level == 0
                      ? "ماجستير"
                      : user.level == 1
                        ? "دكتوراه"
                        : null}
                  </td>
                </tr>
              )}
              <tr>
                <td>تاريخ طلب كود الدفع</td>
                <td>
                  {
                    user.req_code_date ? format(user.req_code_date) : null
                  }
                </td>
              </tr>
              {user.submit_date && (
                <tr>
                  <td>تاريخ الطلب</td>
                  <td>
                    {
                      user.submit_date ? format(user.submit_date) : null
                    }
                  </td>
                </tr>
              )}
              {user.edit_date && (
                <tr>
                  <td>تاريخ اخر تعديل</td>
                  <td>
                    {
                      user.edit_date ? format(user.edit_date) : null
                    }
                  </td>
                </tr>
              )}
              <tr>
                <td> نوع الخدمه </td>
                <td>{user.service_name_ar}</td>
              </tr>

              {user.academic && (
                <tr>
                  <td> الشعبه </td>
                  <td>{user.academic}</td>
                </tr>
              )}
              {user.files_numbers && (
                <tr>
                  <td> عدد الابحاث </td>
                  <td>
                    <input
                      className="edit-input-user"
                      type="text"
                      value={user.files_numbers}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        // Check if the input is not empty
                        if (inputValue.trim() !== "") {
                          setUser({ ...user, files_numbers: inputValue });
                        } else {
                          // Display an error or handle it in another way (e.g., show a message)
                          alert("يجب ادخال رقم");
                        }
                      }}
                    />
                  </td>
                  {/* <td>{user.files_numbers}</td> */}
                </tr>
              )}
              {user.publish_date && (
                <tr>
                  <td> تاريخ النشر </td>
                  <td>{user.publish_date?.slice(0, 10)}</td>
                </tr>
              )}
              {user.accept_date && (
                <tr>
                  <td> تاريخ قبول النشر </td>
                  <td>{user.accept_date?.slice(0, 10)}</td>
                </tr>
              )}
            </table>
            <button
              className="atch-btn"
              onClick={() => {
                setConfirmEdit(true);
              }}
              disabled={disabled}
            >
              تعديل بيانات الطالب
              <BiEditAlt />
            </button>
          </div>
        </div>
        {user.hestory_edit !== "" ? (
                  <div className="response-text__container">
                    <h2>
                      طلبات التعديل السابقه
                    </h2>
                    <AiOutlineDown 
                    onClick={() => setShowHistory(!showHistory)}
                    style={{ 
                      cursor: "pointer", 
                      fontSize: "2rem" , 
                      color: "rgb(0, 60, 112)" ,
                      border: "1px solid rgb(0, 60, 112)", 
                      borderRadius: "5px",
                    }}
                     />

                    <div className="response-text" style={showHistory ? { display: "flex" } : { display: "none" }}>
                      {getUpdatedHistory(user.hestory_edit)}
                    </div>
                  </div>
                ) : null}
        <h1>مرفقات الطالب</h1>

        <table class="profile-table">
          <thead>
            <th>المرفقات</th>
            <th>التحكم</th>
          </thead>

          {user.photo_payment_receipt && (
            <tr>
              <td> صوره ايصال الدفع </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.photo_payment_receipt}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.photo_payment_receipt}`, `${user.photo_payment_receipt}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_list && (
            <tr>
              <td> {t(`service5-step-two.research_list`)} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_list}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_list}`, `${user.research_list}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.photo_college_letter && (
            <tr>
              <td> {t("letter")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.photo_college_letter}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.photo_college_letter}`, `${user.photo_college_letter}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_plan_ar_pdf && (
            <tr>
              <td> {t("research")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_ar_pdf}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_ar_pdf}`, `${user.research_plan_ar_pdf}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_plan_ar_word && (
            <tr>
              <td>{t("research-word")}</td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_ar_word}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_ar_word}`, `${user.research_plan_ar_word}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_plan_en_word && (
            <tr>
              <td> {t("research-word-en")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_en_word}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_en_word}`, `${user.research_plan_en_word}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.research_plan_en_pdf && (
            <tr>
              <td> {t("research-en")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_en_pdf}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.research_plan_en_pdf}`, `${user.research_plan_en_pdf}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.translation_paper && (
            <tr>
              <td>{t("translation")}</td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.translation_paper}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.translation_paper}`, `${user.translation_paper}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.message_word_ar && (
            <tr>
              <td> {t("service2-step-two.research-word")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.message_word_ar}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.message_word_ar}`, `${user.message_word_ar}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.message_pdf_ar && (
            <tr>
              <td> {t("service2-step-two.research")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.message_pdf_ar}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.message_pdf_ar}`, `${user.message_pdf_ar}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.quote_check_form && (
            <tr>
              <td> {t("service2-step-two.form")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.quote_check_form}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.quote_check_form}`, `${user.quote_check_form}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.decision && (
            <tr>
              <td> {t("service7-step3")} </td>
              <td className="att-row">
                <button
                  onClick={() => {
                    openImage(
                      `${API_URL}/${user.national_id}/${user.decision}`
                    );
                  }}
                  class="atch-btn"
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    downloadImage(
                      `${API_URL}/${user.national_id}/${user.decision}`, `${user.decision}`
                    );
                  }}
                  class="atch-btn atch-btn2"
                >
                  Download
                </button>
              </td>
            </tr>
          )}
          {user.files_numbers &&
            Array.from(Array(user.files_numbers), (e, i) => (
              <React.Fragment key={i}>
                {user[`research${i + 1}_image_word`] && (
                  <tr>
                    <td>
                      {" "}
                      {t(
                        `service${user.service_id}-step-two.word${i + 1}`
                      )}{" "}
                    </td>
                    <td className="att-row">
                      <button
                        onClick={() => {
                          openImage(
                            `${API_URL}/${user.national_id}/${user[`research${i + 1}_image_word`]
                            }`
                          );
                        }}
                        class="atch-btn"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => {
                          downloadImage(
                            `${API_URL}/${user.national_id}/${user[`research${i + 1}_image_word`]}`, `${user[`research${i + 1}_image_word`]}`
                          );
                        }}
                        class="atch-btn atch-btn2"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                )}
                {user[`research${i + 1}_image_pdf`] && (
                  <tr>
                    <td>
                      {" "}
                      {t(`service${user.service_id}-step-two.pdf${i + 1}`)}{" "}
                    </td>
                    <td className="att-row">
                      <button
                        onClick={() => {
                          openImage(
                            `${API_URL}/${user.national_id}/${user[`research${i + 1}_image_pdf`]
                            }`
                          );
                        }}
                        class="atch-btn"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => {
                          downloadImage(
                            `${API_URL}/${user.national_id}/${user[`research${i + 1}_image_pdf`]}`, `${user[`research${i + 1}_image_pdf`]}`
                          );
                        }}
                        class="atch-btn atch-btn2"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                )}
                {user[`acceptance_letter${i + 1}`] && (
                  <>
                    <tr>
                      <td>
                        {t(
                          `service${user.service_id
                          }-step-two.acceptance_letter${i + 1}`
                        )}{" "}
                      </td>
                      <td className="att-row">
                        <button
                          onClick={() => {
                            openImage(
                              `${API_URL}/${user.national_id}/${user[`acceptance_letter${i + 1}`]
                              }`
                            );
                          }}
                          class="atch-btn"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => {
                            downloadImage(
                              `${API_URL}/${user.national_id}/${user[`acceptance_letter${i + 1}`]}`, `${user[`acceptance_letter${i + 1}`]}`
                            );
                          }}
                          class="atch-btn atch-btn2"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            ))}
        </table>

        <h1>الرد المرسل من المكتبه</h1>
        <hr style={{ width: "90%", marginBottom: "1rem", height: "3px" }} />
        <div className="resp-cont">
          <div className="resp">
            <h2>
              <span style={{ color: "#19355a" }}>{t("date-response")} </span> :{" "}
              {user.response_date && user.response_date !== "null" && (user.status == 5 || user.status == 6)
                ? format(user.response_date)
                : "لم يتم الرد بعد"}
            </h2>
          </div>

          <div className="resp">
            <h2>
              <span style={{ color: "#19355a" }}>{t("res-code")}</span>:{" "}
              {user.payment_code ? (
                user.payment_code
              ) : user.status == 0 ? (
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="ادخل كود الدفع"
                  onChange={(e) => {
                    setPayment_code(e.target.value);
                  }}
                />
              ) : (
                "لم يتم ارسال كود الدفع بعد"
              )}
            </h2>
          </div>
          {(+user.status !== 1 || +user.status !== 4) && (
            <>
              <div className="resp">
                <h2>
                  <span style={{ color: "#19355a" }}>{t("notes")}</span>
                  {user.response_text &&
                    user.response_text !== "null" &&
                    user.status !== 0 ? (
                    user.response_text
                  ) : user.manager_status === null &&
                    user.response_pdf === null &&
                    user.status == 0 ? (
                    <h3>لم يتم ارسال ملاحظات بعد</h3>
                  ) : (
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="ادخل ملاحظاتك"
                      onChange={(e) => {
                        setResponse({
                          ...response,
                          response_text: e.target.value,
                        });
                      }}
                    />
                  )}
                </h2>
              </div>
              <div className="resp">
                <div className="inputt-atch">
                  {user.response_pdf !== null && user.status !== 0 ? (
                    <div className="atch-btns">
                      <button
                        onClick={() => {
                          openImage(
                            `${API_URL}/${user.national_id}/${user.response_pdf}`
                          );
                        }}
                        className="atch-btn"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => {
                          downloadImage(
                            `${API_URL}/${user.national_id}/${user.response_pdf}`, `${user.response_pdf}`
                          );
                        }}
                        className="atch-btn atch-btn2"
                      >
                        Download
                      </button>
                    </div>
                  ) : user.response_pdf === null &&
                    user.response_text !== "" && user.response_text !== null &&
                    user.status !== 0 ? (
                    <h3>لم يتم ارسال ملف الرد </h3>
                  ) : user.manager_status === null &&
                    user.response_pdf === null &&
                    user.status !== 0 ? (
                    <div className="select-img">
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
                          setResponse({
                            ...response,
                            response_pdf: e.target.files[0],
                          });
                        }}
                      />
                      {response.response_pdf && (
                        <div>
                          <p className="upload-image value">
                            {response.response_pdf.name
                              ? response.response_pdf.name
                              : response.response_pdf}
                          </p>
                          <button
                            className="upload-image openPdf"
                            onClick={() => {
                              window.open(
                                URL.createObjectURL(response.response_pdf)
                              );
                            }}
                          >
                            {t("open")}
                          </button>
                          <AiFillCloseCircle
                            onClick={() => {
                              setResponse({ ...response, response_pdf: "" });
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
                  ) : (user.manager_status !== null &&
                    user.response_pdf === null) ||
                    user.status == 0 ? (
                    <h3>لم يتم ارسال ملف الرد بعد</h3>
                  ) : null}
                  <h2>
                    <span style={{ color: "#19355a" }}>{t("att-res")}</span>{" "}
                  </h2>
                </div>
              </div>
            </>
          )}

          <div className="progress">
            {progress.started && (
              <progress max="100" value={progress.value}></progress>
            )}
            {msg && <p>{msg}</p>}
          </div>
          {response.response_pdf || response.response_text ? (
            <div className="resp two">
              <button
                disabled={disabled}
                className="atch-btn atch-btn2"
                style={{ width: "50%" }}
                onClick={() => {
                  setConfirmA1(true);
                }}
              >
                ارسال
              </button>
            </div>
          ) : null}
          {payment_code && user.status == 0 ? (
            <div className="resp two">
              <button
                disabled={disabled}
                className="atch-btn atch-btn2"
                style={{ width: "50%" }}
                onClick={() => {
                  setConfirmP(true);
                }}
              >
                ارسال كود الدفع
              </button>
            </div>
          ) : null}
        </div>
      </section>
      {errors && <PopupErrorMsg message={errors} onClose={handleCloseError} />}
    </>
  );
};

export default ShowA;
