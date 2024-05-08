import axiosInstance from "@/api/api";
import { Button, Form } from "antd";
import axios from "axios";

import { Cookies } from "react-cookie";
const ResumeList = () => {
  const cookies = new Cookies();
  return (
    <div>
      <Button
        onClick={async () => {
          let response = await axiosInstance.get("/api/v1/chatGpt/modelList");
        }}
      >
        TEST
      </Button>
    </div>
  );
};

export default ResumeList;
