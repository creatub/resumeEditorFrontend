import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "antd";
import axios from "axios";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const navigate = useNavigate();
  return (
    <div>
      <nav className="navbar">
        <div className="navbar_logo">
          <Link to="/">Resume Editor</Link>
        </div>

        <ul className="navbar_menu">
          <li>
            <Link to="/main/resume">자소서 첨삭</Link>
          </li>
          <li>
            <Link to="/main/resumelist">자소서 목록</Link>
          </li>
          <li>
            <Link to="/main/mypage">마이페이지</Link>
          </li>
          <li>
            <Link to="/">뭐라고하지</Link>
          </li>
          <li>
            <Link to="/">뭐라고할까</Link>
          </li>
        </ul>
        {user == true ? (
          <ul className="navbar_links">
            <li>
              <Button
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid white",
                  color: "white",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  let refreshToken = localStorage.getItem("refresh");
                  let res = axios
                    .post(
                      "/logout",
                      {},
                      {
                        headers: {
                          refresh: refreshToken,
                        },
                      }
                    )
                    .then((res) => {
                      if (res.status == 200) {
                        localStorage.removeItem("access");
                        navigate("/");
                      }
                    });
                }}
              >
                로그아웃
              </Button>
            </li>
          </ul>
        ) : (
          <ul className="navbar_links">
            <li>
              <Link to="/">로그인</Link>
            </li>
            <li>
              <Link to="/auth/signup">회원가입</Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
