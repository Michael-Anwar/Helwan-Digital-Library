import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import img from "../../../../images/librarylog.jpg";
import { API_URL } from "../../../../config";
import { saveAs } from "file-saver";
import ReactPaginate from 'react-paginate';


const FReview = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [applicantsPerPage, setApplicantsPerPage] = useState(localStorage.getItem("applicantsPerPage") ? parseInt(localStorage.getItem("applicantsPerPage")) : 5);


  localStorage.setItem("i18nextLng", "ar");

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios.get(`${API_URL}/Fmanager/getReports`, {
        params: {
          page: currentPage,
          limit: applicantsPerPage,
          search: searchText,
          service_id: selectedService,
          response_date: selectedDate
        },
        withCredentials: true,
      })
        .then((res) => {
          setStudent(res.data.result || []);
          setTotalPages(res.data.pages || 1);
          setTotalApplicants(res.data.total || 0);
        })
        .catch((error) => {
          if (error.response.status === 401) window.location.replace("/Library/ManagerLogin");
          window.location.replace("/Library/ManagerLogin");
        });


    } catch (error) {
      if (error.response.status === 401) window.location.replace("/Library/ManagerLogin");
      window.location.replace("/Library/ManagerLogin");
    }
  }, [currentPage, applicantsPerPage, searchText, selectedService, selectedDate]);


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

  console.log("selectedDate", selectedDate);

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
          {/* <h2>الطلاب</h2> */}
          <select
            onChange={(e) => {
              setSelectedService(e.target.value);
            }}
            className="filter"
            value={selectedService}
          >
            <option value="">الكل</option>
            {services.length > 0 && services.map((item) => {
              if (item.id != 1 && item.id != 2) return;
              return (
                <option value={item.id}>{item.service_name_ar}</option>
              )
            })}
          </select>
          <input
            type="text"
            value={searchText}
            style={{ textAlign: "center" }}
            placeholder="بحث بالاسم او الرقم القومي"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />

          <input
            type="date"
            value={selectedDate}
            style={{ textAlign: "center" }}
            placeholder="بحث"
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
          />

          <button
            onClick={() => {
              setCurrentPage(1);
              setSearchText("");
              setSelectedService("");
              setSelectedDate("");
            }}
            className="btn"
          >
            اعاده تعيين البحث
          </button>

        </div>
        <div className="student-container" style={{ marginBottom: "2rem" }}>
          {/* {student  && <h2>{student}</h2>} */}
          {student && student.length > 0 ? (
            <table className="data-table" >
              <thead>
                <tr>
                  <th>التسلسل</th>
                  <th>اسم الطالب</th>
                  <th> نوع الخدمه </th>
                  <th>تاريخ الرد </th>
                  <th> الرد المرسل من المكتبه </th>
                  <th> التقرير \ الافاه </th>
                </tr>
              </thead>
              <tbody>
                {student && student.length > 0 && student.map((item, index) => (
                  <tr key={item.student_id}>
                    <td>{index + 1 + ((currentPage - 1) * applicantsPerPage)}</td>
                    <td>{item.name}</td>
                    <td>{item.service_name_ar}</td>
                    <td>
                      {format(item.response_date)}
                    </td>
                    <td>
                      {item.response_text !== null ? item.response_text : "لا يوجد رد"}
                    </td>
                    <td style={{ width: "20%" }}>
                      <div className="atch-btns">
                        <button
                          onClick={() => {
                            openImage(
                              `${API_URL}/${item.national_id}/${item.response_pdf}`
                            );
                          }}
                          className="atch-btn"
                        >
                          عرض
                        </button>
                        <button
                          onClick={() => {
                            downloadImage(
                              `${API_URL}/${item.national_id}/${item.response_pdf}`, `${item.response_pdf}`
                            );
                          }}
                          className="atch-btn atch-btn2"
                        >
                          تحميل
                        </button>
                      </div>
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

export default FReview;
