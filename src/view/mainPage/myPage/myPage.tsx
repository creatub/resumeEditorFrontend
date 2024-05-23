import axiosInstance from "@/api/api";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface DecodedToken {
  category: string;
  exp: number;
  iat: number;
  role: string;
  uNum: number;
  username: string;
}

interface UserInfo {
  age: number;
  authCode: null;
  birthDate: string;
  company: string;
  delDate: null;
  email: string;
  gender: string;
  inDate: string;
  mode: number;
  occupation: string;
  password: null;
  resumeEditCount: number;
  role: string;
  status: number;
  unum: number;
  username: string;
  wish: string;
}

const MyPage = () => {
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});
  const [userForm] = useForm();
  const fetchUserInfo = () => {
    let res = axiosInstance
      .post("/user/search")
      .then((res) => {
        console.log(res);
        setUserInfo(res.data.response);
        userForm.setFieldsValue({
          username: res.data.response.username,
          age: res.data.response.age,
          email: res.data.response.email,
          gender: res.data.response.gender,
          inDate: res.data.response.inDate.slice(0, 10),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  return (
    <div className="mypageWrapper" style={{ padding: "5% 25%" }}>
      <div
        className="mypageInnerWrapper"
        style={{
          border: "1px solid rgb(220,220,220)",
          padding: "5%",
          borderRadius: "5px",
        }}
      >
        <div className="myPageContentWrapper">
          <Form form={userForm}>
            <Form.Item name="username" label={<b>유저ID</b>}>
              <Input size="large" disabled />
            </Form.Item>
            <Form.Item name="age" label={<b>나이</b>}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="email" label={<b>이메일</b>}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="gender" label={<b>성별</b>}>
              <Input size="large" disabled />
            </Form.Item>
            <Form.Item name="inDate" label={<b>가입일</b>}>
              <Input size="large" disabled />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                style={{
                  backgroundColor: "#85DAD2",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                수정하기
              </Button>
              <Button
                size="large"
                onClick={() => {
                  let accessToken = localStorage.getItem("access") ?? "";
                  let Decoded: DecodedToken = jwtDecode(accessToken);
                  let res = axios
                    .post("/user/delete", {
                      unum: Decoded.uNum,
                    })
                    .then((res) => {
                      console.log(res);
                    });
                }}
                style={{
                  backgroundColor: "#E8524D",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                회원 탈퇴
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
