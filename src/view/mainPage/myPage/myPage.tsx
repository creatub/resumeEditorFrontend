import { Button } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

interface DecodedToken {
  category: string;
  exp: number;
  iat: number;
  role: string;
  uNum: number;
  username: string;
}

const MyPage = () => {
  useEffect(() => {}, []);
  return (
    <div className="mypageWrapper" style={{ padding: "5% 25%" }}>
      <div
        className="mypageInnerWrapper"
        style={{ border: "1px solid rgb(220,220,220)", padding: "5%" }}
      >
        <div className="myPageContentWrapper">ㅎㅇ</div>
      </div>
      <Button
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
      >
        회원 탈퇴
      </Button>
    </div>
  );
};

export default MyPage;
