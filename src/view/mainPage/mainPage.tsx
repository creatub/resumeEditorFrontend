import React, { Suspense, lazy } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import CustomFooter from "../../components/footer";
import Navbar from "@/components/navbar/navbar";
import FAQ from "./faq/faq";

// Lazy load nested components
const ResumeEdit = lazy(() => import("./resumeEdit/resumeEdit"));
const ResumeGuide = lazy(() => import("./resumeGuide/resumeGuide"));
const ResumeListDetails = lazy(() => import("./resumeList/details/details"));
const ResumeHistoryDetail = lazy(
  () => import("./resumeList/details/resumeHistory")
);
const ResumeList = lazy(() => import("./resumeList/resumeList"));
const MyPage = lazy(() => import("./myPage/myPage"));

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<></>}>
        <Routes>
          <Route index element={<ResumeEdit />} />
          <Route path="resumeguide" element={<ResumeGuide />} />
          <Route path="resume" element={<ResumeEdit />} />
          <Route path="resumelist/:id" element={<ResumeListDetails />} />
          <Route path="resumelist" element={<ResumeList />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypage/:id" element={<ResumeHistoryDetail />} />
          <Route path="faq" element={<FAQ />} />
        </Routes>
      </Suspense>
      <CustomFooter />
      <Outlet />
    </div>
  );
};

export default MainPage;
