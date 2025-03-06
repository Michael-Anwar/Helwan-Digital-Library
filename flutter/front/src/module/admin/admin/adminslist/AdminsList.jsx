import React from "react";
import { MdAdd } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import img from "../../../../images/librarylog.jpg";
import { API_URL } from "../../../../config";
import PopupErrorMsg from "../../../../components/error/PopupErrorMsg";
import PopupConfirmMsg from "../../../../components/error/PopupConfirmMsg";

const AdminsList = () => {
  const navigate = useNavigate();
  const [services, setServices] = React.useState([]);
  const [error, setError] = React.useState("");
  const [faculty, setFaculty] = React.useState([]);

  const [managers, setManagers] = React.useState([]);
  const [fManagers, setFManagers] = React.useState([]);
  const [subManagers, setSubManagers] = React.useState([]);

  const [confirm, setConfirm] = React.useState(false);
  const [confirmF, setConfirmF] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const [addManager, setAddManager] = React.useState({
    mname: "",
    email: "",
    service_id: "",
  });

  const [addFManager, setAddFManager] = React.useState({
    faculty_id: "",
  });
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get(`${API_URL}/admin/getallManagers`, { withCredentials: true })
      .then((res) => {
        setManagers(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
        setError("حدث خطأ ما");
      });
    axios.get(`${API_URL}/user/getAllFaculties`, { withCredentials: true })
      .then((res) => {
        setFaculty(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
        setError("حدث خطأ ما");
      });

    axios
      .get(`${API_URL}/admin/getallSubManagers`, { withCredentials: true })
      .then((res) => {
        setSubManagers(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
        setError("حدث خطأ ما");
      });
    axios
      .get(`${API_URL}/user/getAllServices`, { withCredentials: true })
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        setError("حدث خطأ ما");
      });

    axios.get(`${API_URL}/admin/getFacultyManager`, { withCredentials: true })
      .then((res) => {
        setFManagers(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
        setError("حدث خطأ ما");
      });


    if (error) {
      setConfirm(false);
    }
  }, []);


  const handleEditManager = async (index) => {
    try {
      if (managers[index].mname == "") return setError("ادخل اسم الموظف");
      if (managers[index].email == "") return setError("ادخل البريد الالكترونى");
      if (managers[index].service_id == "") return setError("اختر الخدمة");
      let con = window.confirm("هل انت متاكد من التعديل");
      if (con) {
        await axios
          .put(`${API_URL}/admin/updateManager`, managers[index], {
            withCredentials: true,
          })
          .then((res) => {
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setError(error.response.data.message[0].msg);
            console.log(error.response.data.message[0].msg);
          });
      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      // console.log(err);
      setError(err);
    }
  };


  const handleEditSubManager = async (index) => {
    try {
      if (subManagers[index].mname == "") return setError("ادخل اسم الموظف");
      if (subManagers[index].email == "") return setError("ادخل البريد الالكترونى");
      if (subManagers[index].service_id == "") return setError("اختر الخدمة");
      let con = window.confirm("هل انت متاكد من التعديل");
      if (con) {
        await axios
          .put(`${API_URL}/admin/updateManager`, subManagers[index], {
            withCredentials: true,
          })
          .then((res) => {
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setError(error.response.data.message[0].msg ? error.response.data.message[0].msg : error.response.data.message);
            // console.log(error.response.data.message
          });
      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      // console.log(err);
      setError(err);
    }
  };

  const handleDeleteManger = (index) => {
    try {
      let con = window.confirm("هل انت متاكد من الحذف");
      if (con) {
        axios
          .delete(`${API_URL}/admin/deleteManager/${managers[index].id}`, {
            withCredentials: true,
          })
          .then((res) => {
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setError(error.response.data.message[0]);
          });
      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      setError("حدث خطأ ما");
    }
  };
  const handleDeleteSubManger = (index) => {
    try {
      let con = window.confirm("هل انت متاكد من الحذف");
      if (con) {
        axios
          .delete(`${API_URL}/admin/deleteManager/${subManagers[index].id}`, {
            withCredentials: true,
          })
          .then((res) => {
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setError(error.response.data.message[0]);


          });
      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      setError("حدث خطأ ما");
    }
  };

  const addM = () => {
    try {
      if (
        addManager.mname !== "" &&
        addManager.email !== ""
      ) {
        axios
          .post(`${API_URL}/admin/addManager`, addManager, {
            withCredentials: true,
          })
          .then((res) => {
            setError("تم اضافه الموظف");
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setConfirm(false);
            let err = error.response.data?.message || error.response.data?.message[0].msg;
            return setError(err);
          });
      } else {
        if (addManager.mname == "") {
          return setError("ادخل اسم الموظف");
        }
        if (addManager.email == "") {
          return setError("ادخل البريد الالكترونى");
        }

      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      setError(err);
    }
  };

  const addF = () => {
    try {
      if (addFManager.faculty_id !== "") {
        axios.post(`${API_URL}/admin/addFacultyManager`, addFManager, { withCredentials: true })
          .then((res) => {
            setError("تم اضافه الموظف");
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setConfirmF(false);
            if (error.response.status === 500) return setError("حدث خطأ ما");
            let err = error.response.data?.message || error.response.data?.message[0].msg;
            return setError(err);
          });
      } else {
        if (addFManager.faculty_id == "") {
          return setError("اختر الكلية");
        }
      }
    } catch (err) {
      setError("حدث خطأ ما");
    }
  };

  const handleEdits2 = (index) => {
    try {
      if (services[index].service_name_ar == "")
        return setError("ادخل اسم الخدمة بالعربى");
      if (services[index].pref_ar == "")
        return setError("ادخل وصف الخدمة بالعربى");
      if (services[index].service_name == "")
        return setError("ادخل اسم الخدمة بالانجليزى");
      if (services[index].pref == "")
        return setError("ادخل وصف الخدمة بالانجليزى");
      if (services[index].payment_note_ar == "")
        return setError("ادخل تعليمات الدفع بالعربى");
      if (services[index].payment_note == "")
        return setError("ادخل تعليمات الدفع بالانجليزى");

      let con = window.confirm("هل انت متاكد من التعديل");
      if (con) {
        axios
          .put(`${API_URL}/admin/updateService`, services[index], {
            withCredentials: true,
          })
          .then((res) => {
            setError("تم التعديل");

            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setError(error.response.data.message[0].msg);
          });
      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      setError(err);
    }
  };

  const handleEnable = (index) => {
    try {
      let con = window.confirm("هل انت متاكد من التعديل ");
      if (con) {
        axios
          .put(`${API_URL}/admin/enableService`, services[index], {
            withCredentials: true,
          })
          .then((res) => {
            setError("تم ");
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setError(error.response.data.message[0].msg);
          });
      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      setError(err);
    }
  };

  const handleCloseError = () => {
    setError("");
    setConfirm(false);
    setConfirmF(false);
  };


  const handleEditFManager = async (index) => {
    try {
      if (fManagers[index].email == "") return setError("ادخل البريد الالكترونى");
      if (fManagers[index].faculty_id == "") return setError("اختر الكلية");
      let con = window.confirm("هل انت متاكد من التعديل");
      if (con) {
        await axios
          .put(`${API_URL}/admin/updateFacultyManager`, fManagers[index], {
            withCredentials: true,
          })
          .then((res) => {
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setError(error?.response?.data?.message[0]?.msg ? error?.response?.data?.message[0]?.msg  : error?.response?.data?.message);
          });
      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      setError(err);
    }
  };

  const handleDeleteFManger = (index) => {
    try {
      let con = window.confirm("هل انت متاكد من الحذف");
      if (con) {
        axios
          .delete(`${API_URL}/admin/deleteFacultyManager/${fManagers[index].id}`, {
            withCredentials: true,
          })
          .then((res) => {
            window.location.reload();
          })
          .catch((error) => {
            if (error.response.status === 401) window.location.replace("/Library/AdminLogin");
            setError(error.response.data.message[0]);
          });
      }
    } catch (err) {
      if (err.response.status === 401) window.location.replace("/Library/AdminLogin");
      setError("حدث خطأ ما");
    }
  };


  return (
    <div className="super-container">
      {confirm && (<PopupConfirmMsg message={"هل انت متأكد من اضافه الموظف ؟"} onClose={handleCloseError} onSubmit={addM} />)}
      {confirmF && (<PopupConfirmMsg message={"هل انت متأكد من اضافه الموظف ؟"} onClose={handleCloseError} onSubmit={addF} />)}
      <img src={img} alt="img" />
      <section className="cotainer-stu">
        <div className="student-container">
          <div className="add-manager">
            <h3 className="table-title-h2"> اضافه موظف </h3>
            <input
              style={{ fontSize: "1.5rem" }}
              id="add-p"
              onChange={(e) => {
                setAddManager({ ...addManager, mname: e.target.value });
              }}
              type="text"
              placeholder="اسم الموظف"
            />
            <input
              style={{ fontSize: "1.5rem" }}
              id="add-p"
              onChange={(e) => {
                setAddManager({ ...addManager, email: e.target.value });
              }}
              type="email"
              placeholder="البريد الالكترونى"
            />

            <select
              onChange={(e) => {
                setAddManager({ ...addManager, service_id: e.target.value });
              }}
            >
              <option value=""> الخدمة </option>
              {services.length > 0 && services?.map((item) => {
                return (
                  <option value={item.id}> {item.service_name_ar} </option>
                );
              })}
            </select>

            <button
              onClick={() => {
                setConfirm(true);
              }}
              className="add"
            >
              {" "}
              <MdAdd /> اضافه الموظف
            </button>

          </div>
          <hr style={{ width: "80%", margin: "2rem 0" }} />
          <h2 className="table-title-h2">ادارة الموظفين</h2>
          <table className="data-table">
            <tr>
              <th> اسم الموظف </th>
              <th> البريد الالكترونى </th>
              <th> الخدمة</th>
              <th> تعديل</th>
            </tr>

            {managers.length > 0 &&
              managers.map((manager, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input
                        className="input-cell"
                        type="text"
                        value={manager.mname}
                        placeholder={manager.mname}
                        onChange={(e) => {
                          const updatedManagers = [...managers];
                          updatedManagers[index] = {
                            ...manager,
                            mname: e.target.value,
                          };
                          setManagers(updatedManagers);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        className="input-cell"
                        type="text"
                        value={manager.email}
                        placeholder={manager.email}
                        onChange={(e) => {
                          const updatedManagers = [...managers];
                          updatedManagers[index] = {
                            ...manager,
                            email: e.target.value,
                          };
                          setManagers(updatedManagers);
                        }}
                      />
                    </td>
                    <td>
                      <select
                        name=""
                        id=""
                        className="ser-select"
                        value={manager.service_id}
                        onChange={(e) => {
                          const updatedManagers = [...managers];
                          updatedManagers[index] = {
                            ...manager,
                            service_id: e.target.value,
                          };
                          setManagers(updatedManagers);
                        }}
                      >
                        {Array.isArray(services) && services.map((service) => (
                          <option value={service.id}>
                            {service.service_name_ar}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          handleEditManager(index);
                        }}
                      >
                        تعديل
                      </button>
                      <button
                        className="delete"
                        onClick={() => {
                          handleDeleteManger(index);
                        }}
                      >
                        حذف الموظف
                      </button>
                    </td>
                  </tr>
                );
              })}
            {subManagers.length > 0 &&
              subManagers.map((manager, index1) => {
                return (
                  <tr key={index1}>
                    <td>
                      <input
                        className="input-cell"
                        type="text"
                        value={manager.mname}
                        placeholder={manager.mname}
                        onChange={(e) => {
                          const updatedManagers = [...subManagers];
                          updatedManagers[index1] = {
                            ...manager,
                            mname: e.target.value,
                          };
                          setSubManagers(updatedManagers);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        className="input-cell"
                        type="text"
                        value={manager.email}
                        placeholder={manager.email}
                        onChange={(e) => {
                          const updatedManagers = [...subManagers];
                          updatedManagers[index1] = {
                            ...manager,
                            email: e.target.value,
                          };
                          setSubManagers(updatedManagers);
                        }}
                      />
                    </td>
                    <td>
                      <h2>
                        الموظف غير مرتبط بخدمة
                      </h2>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          handleEditSubManager(index1);
                        }}
                      >
                        تعديل
                      </button>
                      <button
                        className="delete"
                        onClick={() => {
                          handleDeleteSubManger(index1);
                        }}
                      >
                        حذف الموظف
                      </button>
                    </td>
                  </tr>
                );
              })}
          </table>
        </div>
      </section>
      <section className="cotainer-stu">
        <div className="student-container">
          <div className="add-manager">
            <h3 className="table-title-h2"> اضافه موظف الكلية </h3>

            <select
              onChange={(e) => {
                setAddFManager({ ...addFManager, faculty_id: e.target.value });
              }}
            >
              <option value=""> الكليات </option>
              {faculty.length > 0 && faculty?.map((item) => {
                return (
                  <option value={item.faculty_id}> {item.faculty_name_ar} </option>
                );
              }
              )}
            </select>

            <button
              onClick={() => {
                setConfirmF(true);
              }}
              className="add"
            >
              {" "}
              <MdAdd /> اضافه الموظف
            </button>

          </div>
          <hr style={{ width: "80%", margin: "2rem 0" }} />
          <h2 className="table-title-h2">ادارة الموظفين</h2>
          <table className="data-table">
            <tr>
              <th> البريد الالكترونى </th>
              <th> الكلية</th>
              <th> الباسورد</th>
              <th> تعديل</th>
            </tr>

            {fManagers.length > 0 &&
              fManagers.map((manager, index) => {
                return (
                  <tr key={index}>
                    <td>
                        {manager.email}
                    </td>
                    <td>
                        {manager.faculty_name_ar}
                    </td>
                    <td>
                        {manager.password === "12345678Abc" ? manager.password  : "تم تغيير الباسورد"}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          handleEditFManager(index);
                        }}
                      >
                        اعادة تعيين الباسورد
                      </button>
                      <button
                        className="delete"
                        onClick={() => {
                          handleDeleteFManger(index);
                        }}
                      >
                        حذف الموظف
                      </button>
                    </td>
                  </tr>
                );
              })}

          </table>
        </div>
      </section>
      <section className="cotainer-stu" style={{ marginTop: "2rem" }}>
        <div className="student-container">
          <h2 className="table-title-h2">ادارة الخدمات</h2>
          <table className="data-table">
            <tr>
              <th> اسم الخدمة بالعربى </th>
              <th> اسم الخدمة بالانجليزى </th>
              <th> الوصف بالعربى </th>
              <th> الوصف بالانجليزى </th>
              <th> تعليمات الدفع بالعربى </th>
              <th> تعليمات الدفع بالانجليزى </th>
              <th> التحكم </th>
            </tr>

            {services.map((service, index) => {
              if (index >= 8) {
                return null; // Skip rendering for index >= 5
              }
              return (
                <tr key={index}>
                  <td style={{ width: "15%" }}>
                    <textarea
                      className="input-cell"
                      type="text"
                      value={service.service_name_ar}
                      placeholder={service.service_name_ar}
                      onChange={(e) => {
                        const updatedservices = [...services];
                        updatedservices[index] = {
                          ...service,
                          service_name_ar: e.target.value,
                        };
                        setServices(updatedservices);
                      }}
                    />
                  </td>
                  <td style={{ width: "15%" }}>
                    <textarea
                      className="input-cell"
                      type="text"
                      value={service.service_name}
                      placeholder={service.service_name}
                      onChange={(e) => {
                        const updatedservices = [...services];
                        updatedservices[index] = {
                          ...service,
                          service_name: e.target.value,
                        };
                        setServices(updatedservices);
                      }}
                    />
                  </td>
                  <td>
                    <textarea
                      className="input-cell"
                      type="text"
                      value={service.pref_ar}
                      placeholder={service.pref_ar}
                      onChange={(e) => {
                        const updatedservices = [...services];
                        updatedservices[index] = {
                          ...service,
                          pref_ar: e.target.value,
                        };
                        setServices(updatedservices);
                      }}
                    />
                  </td>
                  <td>
                    <textarea
                      className="input-cell"
                      type="text"
                      value={service.pref}
                      placeholder={service.pref}
                      onChange={(e) => {
                        const updatedservices = [...services];
                        updatedservices[index] = {
                          ...service,
                          pref: e.target.value,
                        };
                        setServices(updatedservices);
                      }}
                    />
                  </td>
                  <td>
                    <textarea
                      className="input-cell"
                      type="text"
                      value={service.payment_note_ar}
                      placeholder={service.payment_note_ar}
                      onChange={(e) => {
                        const updatedservices = [...services];
                        updatedservices[index] = {
                          ...service,
                          payment_note_ar: e.target.value,
                        };
                        setServices(updatedservices);
                      }}
                    />
                  </td>
                  <td>
                    <textarea
                      className="input-cell"
                      type="text"
                      value={service.payment_note}
                      placeholder={service.payment_note}
                      onChange={(e) => {
                        const updatedservices = [...services];
                        updatedservices[index] = {
                          ...service,
                          payment_note: e.target.value,
                        };
                        setServices(updatedservices);
                      }}
                    />
                  </td>
                  <td style={{ width: "15%" }}>
                    <button
                      onClick={() => {
                        handleEdits2(index);
                      }}
                    >
                      تعديل
                    </button>

                    {+service.enabled == 1 ? (
                      <button
                        className="delete"
                        onClick={() => {
                          handleEnable(index);
                        }}
                      >
                        ايقاف مؤقت للخدمة
                      </button>
                    ) : (
                      <button
                        className="enable"
                        onClick={() => {
                          handleEnable(index);
                        }}
                      >
                        تشغيل الخدمة
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </section>
      {error && <PopupErrorMsg message={error} onClose={handleCloseError} />}
    </div>
  );
};

export default AdminsList;
