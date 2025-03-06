import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Register from "./module/user/register/Register.jsx";
import Login from "./module/user/login/Login.jsx";
import Upage from "./module/user/userpage/Upage.jsx";
import Profile from "./module/user/profile/Profile.jsx";
import Home from "./module/user/home/Home.jsx";
import Service from "./module/user/service/Service.jsx";
import Instructons from "./module/user/instructions/Instructons.jsx";
import Paymentcode from "./module/user/payment/Paymentcode.jsx";
import Myser from "./module/user/myser/Myser.jsx";
import AllService from "./module/user/AllService/AllService.jsx";
import About from "./module/user/about/About.jsx";
import Contact from "./module/user/contact/Contact.jsx";
import ServiceStepTwo from "./module/user/serviceStepTwo/ServiceStepTwo.jsx";
import ManagerLogin from "./module/admin/Alogin/ManagerLogin.jsx";
import SendToUser from "./module/admin/manager/contact/SendToUser.jsx";
import Manager from "./module/admin/manager/Manager.jsx";
import { SuperAdmin } from "./module/admin/SuperAdmin/SuperAdmin.jsx";
import StudentListadmin from "./module/admin/manager/studentList/StudentList.jsx";
import Review from "./module/admin/manager/review/Review.jsx";
import Show from "./module/admin/manager/show/Show.jsx";
import ShowOnly from "./module/admin/manager/show/ShowOnly.jsx";
import Reviewed from "./module/admin/manager/reviewed/Reviewed.jsx";
import AdminLogin from "./module/admin/admin/AdminLog/AdminLogin.jsx";
import Admin from "./module/admin/admin/Admin.jsx";
import Charts from "./module/admin/admin/charts/Charts.jsx";
import All from "./module/admin/manager/all/All.jsx";
import AllApp from "./module/admin/manager/all/AllApp.jsx";
import AllToCode from "./module/admin/manager/all/AllToCode.jsx";
import Allrequests from "./module/admin/admin/allusers/Allrequests.jsx";
import AllUsers from "./module/admin/admin/allusers/AllUsers.jsx";
import AShow from "./module/admin/admin/Ashow/Ashow.jsx";
import AdminReset from "./module/admin/admin/AdminLog/AdminReset.jsx";
import AdminsList from "./module/admin/admin/adminslist/AdminsList.jsx";
import UserReset from "./module/user/login/UserReset.jsx";
import ManagerReset from "./module/admin/Alogin/ManagerReset.jsx";
import Send from "./module/user/contact/Send.jsx";
import Showmsg from "./module/user/contact/Show.jsx";
import ContactManager from "./module/admin/manager/contact/Contact.jsx";
import ShowManager from "./module/admin/manager/contact/Show.jsx";
import SendManager from "./module/admin/manager/contact/Send.jsx";
import Events from "./module/admin/admin/events/Events.jsx";
import ReviewDone from "./module/admin/manager/review/ReviewDone.jsx";
import FManager from "./module/admin/Fmanager/FManager.jsx"
import FReview from "./module/admin/Fmanager/review/FReview.jsx";



const Router = createBrowserRouter([
  {
    path: "/Library/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Upage />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "/Library/about",
            element: <About />,
          },
          {
            path: "/Library/contact",
            children: [
              {
                path: "",
                element: <Contact />,
              },
              {
                path: "/Library/contact/send",
                element: <Send />,
              },
              {
                path: "/Library/contact/show",
                element: <Showmsg/>,
              },
            ],
          },
          {
            path: "/Library/profile",
            element: <Profile />,
          },
          {
            path: "/Library/allServices",
            element: <AllService />,
          },
          {
            path: "/Library/Myservices",
            element: <Myser />,
          },
          {
            path: "/Library/service/:id",
            element: <Service />,
          },
          {
            path: "/Library/serviceStepTwo/:id/:id2",
            element: <ServiceStepTwo />,
          },
          {
            path: "/Library/serviceStepTwo/:id/:id2/:num",
            element: <ServiceStepTwo />,
          },
          {
            path: "/Library/instructions/:id",
            element: <Instructons />,
          },
          {
            path: "/Library/pay/:id",
            element: <Paymentcode />,
          },
        ],
      },
      {
        path: "/Library/register",
        element: <Register />,
      },
      {
        path: "/Library/login",
        element: <Login />,
      },
      {
        path: "/Library/ManagerLogin",
        element: <ManagerLogin />,
      },
      {
        path: "/Library/AdminLOgin",
        element: <AdminLogin />,
      },
      {
        path: "/Library/AdminReset",
        element: <AdminReset />,
      },
      {
        path: "/Library/resetpassword",
        element: <UserReset />,
      },
      {
        path: "/Library/managerReset",
        element: <ManagerReset />,
      },
      {
        path: "/Library/manager",
        element: <Manager />,
        children: [
          {
            path: "",
            element: <Review />,
          },
          {
            path: "/Library/manager/all",
            element: <All />,
          },
          {
            path: "/Library/manager/AllApp",
            element: <AllApp />,
          },
          {
            path: "/Library/manager/AllToCode",
            element: <AllToCode />,
          },
          {
            path: "/Library/manager/reviewed",
            element: <Reviewed />,
          },
          {
            path: "/Library/manager/Review",
            element: <Review />,
          },
          {
            path: "/Library/manager/ReviewDone",
            element: <Review done={true} />,
          },
          {
            path: "/Library/manager/list",
            element: <StudentListadmin />,
          },
          {
            path: "/Library/manager/show/:id",
            element: <Show />,
          },
          {
            path: "/Library/manager/ShowOnly/:id",
            element: <ShowOnly />,
          },
          {
            path: "/Library/manager/contact",
            element: <ContactManager />,
          },
          {
            path: "/Library/manager/showmsg",
            element: <ShowManager />,
          },
          {
            path: "/Library/manager/sendmsg",
            element: <SendManager />,
          },
          {
            path: "/Library/manager/sendMsgToUser",
            element: <SendToUser />,
          },
        ],
      },
      {
        path: "/Library/facultyManager",
        element: <FManager />,
        children: [
          {
            path: "",
            element: <FReview />,
          },
         
        ],
      },
      {
        path: "/Library/Admin",
        element: <Admin />,
        children: [
          {
            path: "",
            element: <Charts />,
          },
          {
            path: "/Library/Admin/allrequests",
            element: <Allrequests />,
          },
          {
            path: "/Library/Admin/AllUsers",
            element: <AllUsers />,
          },
          {
            path: "/Library/Admin/show/:id",
            element: <AShow />,
          },
          {
            path: "/Library/Admin/admins",
            element: <AdminsList />,
          },
          {
            path: "/Library/Admin/events",
            element: <Events />,
          },
        ],
      },
    ],
  },
]);

export default Router;
