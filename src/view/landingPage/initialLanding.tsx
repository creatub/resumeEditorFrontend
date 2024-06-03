import { Button } from "antd";
import React from "react";
import "./arrow.css";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const InitialLanding = ({ scrollToLandingStat }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        style={{
          height: "90vh",
          display: "flex",
        }}
      >
        <div
          className="leftWrapper"
          style={{
            width: "50%",
            height: "90vh",
            paddingTop: "15%",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                marginLeft: "20%",
                fontWeight: "bold",
                fontSize: "3rem",
              }}
            >
              당신의 경험이 빛날 수 있도록
              <br />
            </div>
            <div style={{ marginLeft: "20%", fontSize: "1.5rem" }}>
              <p>
                막막한 자기소개서 작성, 이젠 AI 자소서 컨설턴트
                <br /> REDITOR가 함께하겠습니다.
              </p>
            </div>
            <div style={{ marginLeft: "20%" }}>
              <Button
                size="large"
                style={{
                  height: "55px",
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#85dad2",
                  borderColor: "transparent",
                }}
                onClick={() => {
                  navigate("/auth/login");
                }}
              >
                REDITOR 로그인하기
              </Button>
              <Button
                size="large"
                style={{
                  height: "55px",
                  fontWeight: "bold",
                  border: "2px solid black",
                  marginLeft: "2%",
                }}
                onClick={() => {
                  navigate("/auth/signup");
                }}
              >
                회원가입 먼저하기
              </Button>
            </div>
          </div>
        </div>
        <div
          className="rightWrapper"
          style={{
            display: "flex",
            alignItems: "center",
            width: "50%",
            height: "90vh",
            justifyContent: "center",
          }}
        >
          <img
            src="/img/logo.gif"
            style={{ height: "68%", width: "90%", marginTop: "5%" }}
            alt="이미지를 표시할수 없습니다"
          />
        </div>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button
          size="large"
          style={{
            height: "55px",
            fontWeight: "bold",
            borderRadius: "50px",
            width: "15%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={scrollToLandingStat}
        >
          <span style={{ width: "100%", textAlign: "center" }}>
            더 알아보기
          </span>
        </Button>
      </div>
    </div>
  );
};

export default InitialLanding;
