import React from "react";
import axiosInstance from "@/api/api";
import { Button, Form, Pagination } from "antd";
import "./resumeList.css";
import { EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import axios from "axios";

interface ResumeList {
  num: number;
  r_num: number;
  rating: number;
  rating_count: number;
  read_num: number;
  title: string;
  w_date: string;
  content: string;
}
const ResumeList = () => {
  const [resumeList, setResumeList] = useState<ResumeList[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  async function fetchSearch(search: string) {
    let res = await axiosInstance
      .get("/board/list/search", {
        params: {
          page: 0,
          keyword: search,
        },
      })
      .then((res) => {
        setResumeList(res.data.response);
        setTotalPages(res.data.totalPages);
      });
  }
  async function fetchList(page: number) {
    let res = await axiosInstance
      .get("/board/list", {
        params: {
          page: page - 1,
        },
      })
      .then((res) => {
        setResumeList(res.data.response);
        setTotalPages(res.data.totalPages);
      });
  }
  useEffect(() => {
    fetchList(0);
  }, []);
  return (
    <div>
      <div
        className="search"
        style={{ display: "flex", justifyContent: "center", paddingTop: "3%" }}
      >
        <Search
          onSearch={(value) => {
            fetchSearch(value);
          }}
          size="large"
          placeholder="검색어를 입력하세요"
          style={{ width: "40%" }}
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "3% 0" }}
      >
        <Pagination
          onChange={(page) => {
            fetchList(page);
          }}
          pageSize={5}
          showSizeChanger={false}
          total={totalPages * 5 - 5}
        />
      </div>
      <div className="wrapper">
        <div
          className="innerWrapper"
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
          }}
        >
          {resumeList.map((resume, index) => {
            return (
              <div
                key={`resume.r_num${index}`}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div
                  className="contentBox"
                  style={{
                    width: "50%",
                    border: "1px solid rgb(225,225,225)",
                    padding: "3% 5%",
                    margin: "1% 0",
                  }}
                >
                  <div className="contentTitle">
                    <h3>
                      <Link
                        style={{ color: "black" }}
                        to={`/main/resumelist/${resume.r_num}`}
                      >
                        {resume.title}
                      </Link>
                    </h3>
                  </div>
                  <div
                    className="contentMainText"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      margin: "5% 0",
                      fontSize: "16px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 2,
                      width: "100%",
                    }}
                  >
                    {resume.content}
                  </div>
                  <div
                    className="contentFooter"
                    style={{
                      justifyContent: "space-between",
                      display: "flex",
                      fontSize: "14px",
                    }}
                  >
                    <div className="contentDate">{resume.w_date}</div>
                    <div className="contentView">
                      <EyeOutlined /> {resume.read_num}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResumeList;
