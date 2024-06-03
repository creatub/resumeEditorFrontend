import Avatar from "antd/es/avatar/avatar";
import Button from "antd/es/button";
import Divider from "antd/es/divider";
import Form from "antd/es/form";
import Input from "antd/es/input";
import notification from "antd/es/notification";
import { Link, useNavigate } from "react-router-dom";
import CustomFooter from "../../components/footer";
import axios from "axios";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { login } from "@/store/features/user/userSlice";
import { setToken } from "@/store/features/token/tokenSlice";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { DecodedToken } from "@/types/globalTypes";

const Login = () => {
  const [notify, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const callNotification = () => {
    notify.error({
      message: "로그인 실패",
      description: "아이디와 비밀번호를 확인해주세요",
      placement: "topRight",
      duration: 5,
    });
  };

  const tryLogin = async ({ username, password }) => {
    try {
      let response = await axios
        .post("/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          if (res.status == 200) {
            let accessToken = res.headers["access"];
            let refreshToken = res.headers["refresh"];
            localStorage.setItem("access", accessToken);
            localStorage.setItem("refresh", refreshToken);
            let DecodedToken: DecodedToken = jwtDecode(accessToken);
            dispatch(login());
            dispatch(setToken(DecodedToken));
            if (DecodedToken.role == "ROLE_ADMIN") {
              navigate("/admin/main");
            } else {
              navigate("/main/resume");
            }
          }
        });
    } catch (err) {
      if (err.response.status === 401) {
        console.log(
          err.response.data.message.split(" ")[0],
          err.response.data.message.split("blacklisted").join("")
        );
        if (err.response.data.message.split(" ")[0] === "blacklisted") {
          const blackListedDate = err.response.data.message
            .split("blacklisted")
            .join("")
            .slice(0, 11);
          Swal.fire({
            icon: "error",
            title: "블랙리스트 계정안내",
            text: `해당 계정은 ${blackListedDate}까지 블랙리스트로 지정되었습니다. 관리자에게 문의해주세요.`,
          });
        } else {
          callNotification();
        }
      }
    }
  };

  return (
    <div style={{ marginTop: "5vh" }}>
      {contextHolder}
      <div
        className="wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          className="signUpWrpper"
          style={{
            width: "40vw",
            height: "70%",
            border: "1px solid rgb(224,224,224)",
            marginTop: "5vh",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              marginTop: "5%",
            }}
          >
            <div>
              <span style={{ fontSize: "28px" }}>돌아오신걸 환영합니다!</span>
            </div>
            <div className="subMessage" style={{ color: "rgb(143,143,143)" }}>
              <p>오늘도 REDITOR가 최선을 다해 도와줄게요!</p>
            </div>
            <div>
              <span>더 알아보고 싶으신가요?</span>
              <Link
                to="/"
                style={{
                  color: "black",
                  marginLeft: "5px",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                배너로 이동하기
              </Link>
            </div>
          </div>
          <div
            className="signUpInnerWrapper"
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              className="formWrapper"
              style={{ marginTop: "7%", width: "60%" }}
            >
              <Form onFinish={tryLogin}>
                <Form.Item name="username" style={{ marginBottom: "2%" }}>
                  <Input
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="아이디 입력"
                  />
                </Form.Item>
                <Form.Item name="password">
                  <Input
                    type="password"
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="비밀번호 입력"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{
                      width: "100%",

                      fontWeight: "bold",
                      fontSize: "16px",
                      height: "50px",
                    }}
                  >
                    로그인
                  </Button>
                </Form.Item>
              </Form>
              <Divider
                orientation="center"
                style={{ color: "rgb(200,200,200)" }}
              >
                또는
              </Divider>
              <Button
                style={{
                  width: "100%",

                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "white",
                  backgroundColor: "#85dad2",
                  height: "50px",
                }}
                onClick={() => {
                  navigate("/auth/signup");
                }}
              >
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CustomFooter />
    </div>
  );
};

export default Login;
