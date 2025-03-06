import React, { useEffect, useState } from "react";
import "./charts.css";
import { AiOutlineUser } from "react-icons/ai";
import Slider from "../../../../components/Slider/Slider";
import { BarChart } from "@mui/x-charts/BarChart";
import { API_URL } from "../../../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Charts = () => {
  const [isExpanded, setExpanded] = useState(false);
  const [data, setData] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  // const [service, setfilter] = useState([])
  useEffect(() => {
    axios.defaults.withCredentials = true;
    try {
      axios
        .get(`${API_URL}/admin/getallApplicantsStatus`, {
          params: { 
            service_id: selectedService
           },
           withCredentials: true 
          })
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          if (error.response.status === 401) window.location.replace("/Library/AdminLOgin");
          window.location.replace("/Library/AdminLOgin");
        });
    } catch (err) {
      // console.log(err);
    }
  }, [selectedService]);

  console.log(selectedService);
  return (
    <div className="chart-Grid">
      <div className="filter" style={{ width: "auto" }}>
        <Slider
          filter={selectedService}
          setfilter={setSelectedService}
          
        />
      </div>
      <div className="charts">
        <div className="widget_container">
          <article className="widget">
            <div className="widget-header">
              <AiOutlineUser />
              <p> عدد الطلبات </p>
            </div>
            <h2>{data?.total_requests}</h2>
          </article>
          <article className="widget">
            <div className="widget-header">
              <AiOutlineUser />
              <p>عدد المرسل لهم</p>
            </div>
            <h2>
              {data?.status_5_count}
            </h2>
          </article>
          <article className="widget">
            <div className="widget-header">
              <AiOutlineUser />
              <p>عدد المرفوضين</p>
            </div>
            <h2>
              {data?.status_6_count}
            </h2>
          </article>

          <article className="widget">
            <div className="widget-header">
              <AiOutlineUser />
              <p>عدد الموجودين ب قائمه انتظار كود </p>
            </div>
            <h2>
              {data?.status_0_count}
            </h2>
          </article>
          <article className="widget">
            <div className="widget-header">
              <AiOutlineUser />
              <p> عدد الحاصلين على كود دفع </p>
            </div>
            <h2>
              {data?.status_1_count}
            </h2>
          </article>

          <article className="widget">
            <div className="widget-header">
              <AiOutlineUser />
              <p>عدد الموجودين ب قائمه الانتظار</p>
            </div>
            <h2>
              {data?.status_2_count}
            </h2>
          </article>

          <article className="widget">
            <div className="widget-header">
              <AiOutlineUser />
              <p>عدد الموجودين ب قائمه التعديل</p>
            </div>
            <h2>
              {data?.status_3_count}
            </h2>
          </article>

          <article className="widget">
            <div className="widget-header">
              <AiOutlineUser />
              <p>قائمه التعديل على مرفقات كود الدفع</p>
            </div>
            <h2>
              {data?.status_4_count}
            </h2>
          </article>
        </div>
        <div className="chart" style={{ width: "100%" }}>
          <BarChart
            xAxis={[
              {
                id: "barCategories",
                data: [
                  "خدمه المنح",
                  " خدمه التشكيل ",
                  "خدمه الترقيه",
                  " خدمه التسجيل ",
                  " فحص احسن رساله علميه ",
                  " الفحص الشخصي ",
                  " فحص النشر ",
                  "بنك المعرفه",
                ],
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: [
                  data?.service_7_count,
                  data?.service_2_count,
                  data?.service_5_count,
                  data?.service_1_count,
                  data?.service_6_count,
                  data?.service_3_count,
                  data?.service_4_count,
                  data?.service_8_count,
                ],
              },
            ]}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default Charts;
