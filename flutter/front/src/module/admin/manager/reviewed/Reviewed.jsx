import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import img from "../../../../images/librarylog.jpg";
import { API_URL } from "../../../../config";
import ReactPaginate from 'react-paginate';


const Reviewed = () => {
  const navigate = useNavigate();
  const [student, setStudent] = React.useState([]);
  const [admins, setAdmins] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [applicantsPerPage, setApplicantsPerPage] = useState(localStorage.getItem("applicantsPerPage") ? parseInt(localStorage.getItem("applicantsPerPage")) : 5);


  localStorage.setItem("i18nextLng", "ar");

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios.get(`${API_URL}/manager/getallApplicantsReviewed`, {
        params: {
          page: currentPage,
          limit: applicantsPerPage
        },
        withCredentials: true,
      })
        .then((res) => {
          setStudent(res.data.result || []);
          setTotalPages(res.data.pages);
          setTotalApplicants(res.data.total);
        })
        .catch((error) => {
          if (error.response.status === 401) window.location.replace("/Library/ManagerLogin");
          window.location.replace("/Library/ManagerLogin");
        });

    } catch (error) {
      window.location.replace("/Library/ManagerLogin");
    }
  }, [currentPage, applicantsPerPage]);

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios.get(`${API_URL}/manager/getAllManagersToAssign`, { withCredentials: true })
        .then((res) => {
          setAdmins(res.data);
        })
        .catch((error) => {
          if (error.response.status === 401) window.location.replace("/Library/ManagerLogin");
          window.location.replace("/Library/ManagerLogin");
        });
    } catch (error) {
      window.location.replace("/Library/ManagerLogin");
    }
  }, []);


  const sername = (item) => {
    const ser_name =
      item.ser_reg !== null
        ? "ser_reg"
        : item.ser_formation !== null
          ? "ser_formation"
          : item.ser_grant !== null
            ? "ser_grant"
            : item.ser_personal !== null
              ? "ser_personal"
              : item.ser_upgrade !== null
                ? "ser_upgrade"
                : item.ser_knowledge !== null
                  ? "ser_knowledge"
                  : item.ser_magazine !== null
                    ? "ser_magazine"
                    : item.ser_best !== null
                      ? "ser_best"
                      : null;

    return ser_name;
  };
  const app_id = (item) => {
    const appid =
      item.ser_reg !== null
        ? item.ser_reg
        : item.ser_formation !== null
          ? item.ser_formation
          : item.ser_grant !== null
            ? item.ser_grant
            : item.ser_personal !== null
              ? item.ser_personal
              : item.ser_upgrade !== null
                ? item.ser_upgrade
                : item.ser_knowledge !== null
                  ? item.ser_knowledge
                  : item.ser_magazine !== null
                    ? item.ser_magazine
                    : item.ser_best !== null
                      ? item.ser_best
                      : null;

    return appid;
  };
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

  return (
    <div className="super-container">
      <img src={img} alt="img" />

      <section className="cotainer-stu">
        <div className="navv">
          {/* <h2>الطلاب</h2> */}
          {/* <select
            onChange={(e) => {
              const filteredStudents = e.target.value === ''
                ? student
                : student.filter((item) => item.status === parseInt(e.target.value));
              setFilter(filteredStudents);
              setFilter2(filteredStudents);
            }}
            className='filter'
            name=""
            id=""
          >
            <option value="">الكل</option>
            <option value="5">مرفوض من الجامعه</option>
            <option value="4">موافقه من الجامعه</option>
            <option value="1">موافقه كليه</option>
          </select> */}
        </div>
        <div className="student-container">
          {/* {student  && <h2>{student}</h2>} */}
          {student.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>التسلسل</th>
                  <th>اسم الطالب</th>
                  <th> نوع الخدمه </th>
                  <th>تاريخ التقديم</th>
                  <th> حاله الخدمه </th>
                  <th> الموظف الموزع</th>
                  <th> الموظف المسؤول </th>
                  <th>التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {student.length > 0 &&
                  student.map((item, index) => {
                    if (item.status == 5) return "5"
                    return (
                      <tr key={item.student_id}>
                        <td>{index + 1 + (currentPage - 1) * applicantsPerPage}</td>
                        <td>{item.name}</td>
                        <td>{item.service_name_ar}</td>
                        <td>
                          {item.status === 0
                            ? format(item.req_code_date)
                            : format(item.submit_date)}
                        </td>
                        <td>
                          {item.status === 0
                            ? "منتظر كود دفع"
                            : item.status === 1
                              ? "في انتظار رفع المرفقات"
                              : item.status === 2
                                ? "في انتظار رد المكتبه"
                                : item.status === 3
                                  ? "قيد التعديل"
                                  : item.status === 4
                                    ? "قيد التعديل"
                                    : item.status === 5
                                      ? "تم الارسال"
                                      : item.status === 6
                                        ? "مرفوض"
                                        : null}
                        </td>
                        <td>
                          {item.manager_responsible !== null ?
                            admins.filter((admin) => admin.id == item.manager_responsible)
                              .map((admin) => admin.mname) : "لم يتم تحديد موظف"}
                        </td>
                        <td>
                          {item.manager_id !== null ?
                            admins.filter((admin) => admin.id == item.manager_id)
                              .map((admin) => admin.mname) : "لم يتم تحديد موظف"}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              navigate(
                                `/Library/manager/show/${item.user_id},${item.service_id
                                },${sername(item)},${app_id(item)}`
                              );
                            }}
                          >
                            {/* <Link to={`/manager/show/${item.user_id},${item.service_id},${sername(item)},${app_id(item)}`}> */}
                            تفاصيل
                            {/* </Link> */}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          ) : (
            <h2 style={{ marginBottom: "1rem" }}>لا يوجد طلبات بعد</h2>
          )}
        </div>
        {student && student.length > 0 &&
            <>
              <ReactPaginate
                previousLabel={'السابق'}
                nextLabel={'التالي'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(e) => setCurrentPage(e.selected + 1)}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}

              />

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem",gap:"1rem" }}>
              <span style={{ fontSize: "1.2rem" }}>عدد الطلبات : {totalApplicants}</span>
              </div>
            </>
          }
      </section>
    </div>
  );
};

export default Reviewed;
