import { Outlet, Route, Routes } from "react-router-dom";
import CustomFooter from "../../components/footer";
import Navbar from "@/components/navbar/navbar";
import React from "react";
import ResumeEdit from "./resumeEdit/resumeEdit";
import MyPage from "./myPage/myPage";
import ResumeListDetails from "./resumeList/details/details";
import ResumeList from "./resumeList/resumeList";
import ResumeHistoryDetail from "./resumeList/details/resumeHistory";

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <CustomFooter />
    </div>
  );
};

export default MainPage;
