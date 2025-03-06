import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import img from "../../../../images/librarylog.jpg";
import { API_URL } from "../../../../config";
import ReactPaginate from 'react-paginate';
import PopupConfirmMsg from "../../../../components/error/PopupConfirmMsg";


const AllUsers = () => {
  const navigate = useNavigate();
  const [student, setStudent] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [applicantsPerPage, setApplicantsPerPage] = useState(localStorage.getItem("applicantsPerPage") ? parseInt(localStorage.getItem("applicantsPerPage")) : 5);
  const [search, setSearch] = useState("");
  const [cofirmDelete, setCofirmDelete] = useState(false);
  const [id, setId] = useState(null);
  const [national_id, setNationalId] = useState(null);

  localStorage.setItem("i18nextLng", "ar");

  useEffect(() => {
    try {
      axios.defaults.withCredentials = true;
      axios
        .get(`${API_URL}/admin/getallUsers`, {
          params: {
            page: currentPage,
            limit: applicantsPerPage,
            search: search,
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
  }, [currentPage, applicantsPerPage, search]);


  const handleDelete = (id, national_id) => {
    try {
      axios.defaults.withCredentials = true;
      axios
        .delete(`${API_URL}/admin/deleteUser/${id}/${national_id}`, {
          withCredentials: true,
        })
        .then((res) => {
            alert("تم حذف الباحث بنجاح");
            window.location.reload();
        })
        .catch((error) => {
          if (error.response.status === 401) window.location.replace("/Library/AdminLOgin");
          // window.location.replace("/Library/AdminLOgin");
        });
    } catch (error) { 
      console.log(error);
      window.location.replace("/Library/AdminLOgin");
    }
  }
  
  const handleClose = () => {
    setCofirmDelete(false);
  }
  
  return (
    <div className="super-container">
      {cofirmDelete && 
      <PopupConfirmMsg 
        message={"هل انت متأكد من حذف الباحث؟"}
        onClose={handleClose}
        onSubmit={() => handleDelete(id, national_id)}
      />
      }

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
          <h2>الباحثين</h2>
          <input
            type="text"
            value={search}
            style={{ textAlign: "center" }}
            placeholder="بحث بالاسم او الرقم القومي"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="student-container">
          {/* {student  && <h2>{student}</h2>} */}
          {student.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>رقم الباحث</th>
                  <th>اسم الباحث</th>
                  <th> الايميل </th>
                  <th> رقم الهويه الوطنيه </th>
                  <th> رقم الهاتف </th>
                  <th>
                    عدد الطلبات المقدمه
                  </th>
                  <th>
                    حذف الباحث
                  </th>
                </tr>
              </thead>
              <tbody>
                {student.length > 0 &&
                  student.map((item, index) => (
                    <tr key={item.student_id}>
                      <td>{index + 1 + (currentPage - 1) * applicantsPerPage}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.national_id}</td>
                      <td>
                        {item.phone}
                      </td>
                      <td>{item.submit_count}</td>
                       <td>
                        <button className="btn" onClick={() => {
                          setCofirmDelete(true);
                          setId(item.id);
                          setNationalId(item.national_id);
                        }}>
                          حذف
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

export default AllUsers;
