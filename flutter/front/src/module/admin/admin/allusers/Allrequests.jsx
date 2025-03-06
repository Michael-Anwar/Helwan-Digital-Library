import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import img from "../../../../images/librarylog.jpg";
import { API_URL } from "../../../../config";
import ReactPaginate from 'react-paginate';


const Allrequests = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [applicantsPerPage, setApplicantsPerPage] = useState(localStorage.getItem("applicantsPerPage") ? parseInt(localStorage.getItem("applicantsPerPage")) : 5);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [services, setServices] = useState([]);


  
  localStorage.setItem("i18nextLng", "ar");

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios
        .get(`${API_URL}/admin/getallApplicantsShow`, {
          params: {
            page: currentPage,
            limit: applicantsPerPage,
            search: search,
            status: selectedStatus,
            service: selectedService,
          }, 
          withCredentials: true 
        })
        .then((res) => {
          setStudent(res.data.result || []);
          setTotalPages(res.data.pages);
          setTotalApplicants(res.data.total);
        })
        .catch((error) => {
          if (error.response.status === 401) window.location.replace("/Library/AdminLOgin");
          window.location.replace("/Library/AdminLOgin");
        });
    } catch (error) { }
  }, [currentPage, applicantsPerPage, search, selectedStatus, selectedService]);

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios.get(`${API_URL}/user/getAllServices`, { withCredentials: true })
        .then((res) => {
          setServices(res.data);
        })
        .catch((error) => {
          if (error.response.status === 401) window.location.replace("/Library/ManagerLogin");
          window.location.replace("/Library/ManagerLogin");
        });

    } catch (error) {
      if (error.response.status === 401) window.location.replace("/Library/ManagerLogin");
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

  return (
    <div className="super-container">
      <img src={img} alt="img" />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <select
          style={{ fontSize: '.8rem' }}
          value={applicantsPerPage}
          onChange={(e) => {
            setApplicantsPerPage(e.target.value);
            localStorage.setItem('applicantsPerPage', e.target.value);
          }}
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
        </select>
        <h3 style={{ fontSize: '.7rem' }}>
          عدد الطلبات في الصفحة
        </h3>
      </div>
      <section className="cotainer-stu">
        <div className="navv">
        <select
            onChange={(e) => {
              setSelectedService(e.target.value);
            }}
            className="filter"
            value={selectedService}
          >
            <option value="">الكل</option>
            {services.length > 0 && services.map((item) => {
              if (item.id == 9 ) return;
              return (
                <option value={item.id}>{item.service_name_ar}</option>
              )
            })}
          </select>
          <input
            type="text"
            value={search}
            style={{ textAlign: "center" }}
            placeholder="بحث بالاسم او الرقم القومي"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <select
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
            className="filter"
            name=""
            id=""
          >
            <option value=""> الكل </option>
                <option value="10"> منظر كود دفع </option>
                <option value="1"> حصل علي كود دفع ولم يرفع المرفقات بعد </option>
                <option value="2"> قيد الانتظار </option>
                <option value="3"> قيد التعديل علي المرفقات </option>
                <option value="4"> قيد التعديل علي مرفقات الكود </option>
                <option value="5"> تم الارسال </option>
                <option value="6"> مرفوض </option>
          </select>
        </div>
        <div className="student-container">
          {/* {student  && <h2>{student}</h2>} */}
          {student.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th> رقم الطالب </th>
                  <th>اسم الطالب</th>
                  <th> نوع الخدمه </th>
                  <th>تاريخ التقديم</th>
                  <th> حاله الخدمه </th>
                  
                  <th>التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {student.length > 0 &&
                  student.map((item, index) => (
                    <tr key={item.student_id}>
                      <td>{index + 1 + (currentPage - 1) * applicantsPerPage}</td>
                      <td>{item.name}</td>
                      <td>{item.service_name_ar}</td>
                      <td>
                        {item.status === 0
                          ? item.req_code_date?.slice(0, 10)
                          : item.submit_date?.slice(0, 10)}
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
                        <button>
                          <Link
                            to={`/Library/Admin/show/${item.user_id},${item.service_id
                              },${sername(item)},${app_id(item)}`}
                          >
                            تفاصيل
                          </Link>
                        </button>
                      </td>
                    </tr>
                  ))}
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

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem", gap: "1rem" }}>
                <span style={{ fontSize: "1.2rem" }}>عدد الطلبات : {totalApplicants}</span>
              </div>
            </>
          }
      </section>
    </div>
  );
};

export default Allrequests;
