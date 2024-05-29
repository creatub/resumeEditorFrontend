import { Outlet, Route, Routes } from "react-router-dom";
import CustomFooter from "../../components/footer";
import Navbar from "@/components/navbar/navbar";

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
