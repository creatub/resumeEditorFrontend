import axiosInstance from "@/api/api";
import { useEffect, useState } from "react";
import DougnutGraph from "./dougnutGraph";
import { Divider } from "antd";

const AdminUserStat = () => {
  const [userCount, setUserCount] = useState(0);
  const [userGender, setUserGender] = useState({});
  const [employRate, setEmployRate] = useState({});
  const [ageRange, setAgeRange] = useState({});

  const fetchAdminStatData = (group: string) => {
    let res = axiosInstance
      .get(`admin/stat/rank/${group}`)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchUserStatData = (group: string) => {
    let res = axiosInstance
      .get("/admin/stat/user", {
        params: {
          group: group,
        },
      })
      .then((res) => {
        switch (group) {
          case "count":
            setUserCount(res.data.response.total_user);
            break;
          case "gender":
            setUserGender(res.data.response);
            break;
          case "age":
            setAgeRange(res.data.response);
            break;
          case "status":
            setEmployRate(res.data.response);
            break;
        }
      })
      .catch((err) => {
        console.log("데이터를 가져오는데 오류가 발생했습니다", err);
      });
  };
  useEffect(() => {
    Promise.all([
      fetchUserStatData("count"),
      fetchUserStatData("gender"),
      fetchUserStatData("age"),
      fetchUserStatData("status"),
      fetchAdminStatData("occupation"),
      fetchAdminStatData("company"),
    ]);
  }, []);

  const doughnutData = [
    {
      dataObject: userGender,
      labelName: "유저수",
      graphTitle: "성별 비율",
    },
    {
      dataObject: employRate,
      labelName: "비율",
      graphTitle: "취업 비율",
    },
    {
      dataObject: ageRange,
      labelName: "나잇대",
      graphTitle: "나이 비율",
    },
  ];

  const squareData = [
    {
      dataObject: userCount,
      title: "총 유저수",
    },
    {
      dataObject: userCount,
      title: "프로 유저수",
    },
    {
      dataObject: userCount,
      title: "총 방문자수",
    },
    {
      dataObject: userCount,
      title: "오늘 방문자수",
    },
  ];

  return (
    <div className="Wrapper" style={{ padding: "1% 5%" }}>
      <div
        className="statHeader"
        style={{ width: "100%", textAlign: "center" }}
      >
        <h1>{`${new Date().getFullYear()}년 ${new Date().getMonth()}월 ${new Date().getDay()}일 ${new Date().getHours()}:00 기준 통계`}</h1>
      </div>
      <div
        className="squareWrapper"
        style={{
          width: "100%",
          display: "flex",
          marginRight: "3%",
          marginTop: "5%",
          marginBottom: "5%",
        }}
      >
        {squareData.map((data, index) => {
          return (
            <div
              key={`sqaureData${index}`}
              style={{
                width: "25%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                className="squareHeader"
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "3%",
                }}
              >
                {data.title}
              </div>
              <div
                className="squareBody"
                style={{
                  width: "80%",
                  height: "100%",
                  textAlign: "center",
                  fontSize: "30px",
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                {data.dataObject}
              </div>
            </div>
          );
        })}
      </div>
      <Divider style={{ border: "1px solid black" }} />
      <div
        className="doughnutWrapper"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {doughnutData.map((data, index) => {
          return (
            <div style={{ width: "300px" }} key={`doughnut${index}}`}>
              <DougnutGraph
                dataObject={data.dataObject}
                labelName={data.labelName}
                graphTitle={data.graphTitle}
              />
            </div>
          );
        })}
      </div>
      <Divider style={{ border: "1px solid black" }} />
    </div>
  );
};

export default AdminUserStat;
