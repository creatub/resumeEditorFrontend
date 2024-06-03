import axios from "axios";
import React, { CSSProperties, useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const LandingStat = () => {
  const [totalUser, setTotalUser] = useState<number>(0);
  const [totalVisitor, setTotalVisitor] = useState<number>(0);
  const [totalResume, setTotalResume] = useState<number>(0);
  const [totalEdit, setTotalEdit] = useState<number>(0);

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1, // Trigger when 10% of the component is visible
  });

  const animationDuration = 4;

  const fetchLandingStatData = async (group: string) => {
    let res = await axios
      .get("/landing/stat", {
        params: {
          group: group,
        },
      })
      .then((res) => {
        switch (group) {
          case "countUser":
            setTotalUser(res.data.response.total_user);
            break;
          case "visitTotal":
            setTotalVisitor(res.data.response.total_visit);
            break;
          case "editTotal":
            setTotalEdit(res.data.response.edit_count);
            break;
          case "boardTotal":
            setTotalResume(res.data.response.total_board);
            break;
        }
      });
  };

  const dataStyle: CSSProperties = {
    textAlign: "center",
  };

  const dataHeaderStyle: CSSProperties = {
    marginBottom: "5%",
  };
  useEffect(() => {
    Promise.all([
      fetchLandingStatData("countUser"),
      fetchLandingStatData("visitTotal"),
      fetchLandingStatData("editTotal"),
      fetchLandingStatData("boardTotal"),
    ]);
  }, []);

  return (
    <div ref={ref} style={{ paddingTop: "8%" }}>
      <div
        className="landingStatHeader"
        style={{
          width: "100%",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
          당신만을 위한 AI 자소서 컨설턴트
        </div>
        <div style={{ width: "30%", fontSize: "1.3rem", marginTop: "3%" }}>
          <p>
            수많은 취업 준비생들과 이직 준비생들이 Reditor로 자기소개서를
            첨삭하고 있어요.
          </p>
        </div>
      </div>
      <div className="statWrapper" style={{ marginTop: "3%" }}>
        <div
          className="statInnerWrapper"
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            padding: "5%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <div style={dataStyle}>
              <div>
                <img
                  width={50}
                  height={50}
                  src="/img/xo.png"
                  alt="이미지를 표시할수 없습니다!"
                />
              </div>
              <div style={dataHeaderStyle}>첨삭 횟수</div>
              {inView && (
                <CountUp
                  start={0}
                  end={totalEdit}
                  duration={animationDuration}
                />
              )}
              회
            </div>
            <div style={dataStyle}>
              <img
                width={50}
                height={50}
                src="/img/human.png"
                alt="이미지를 표시할수 없습니다!"
              />
              <div style={dataHeaderStyle}>가입한 유저</div>
              {inView && (
                <CountUp
                  start={0}
                  end={totalUser}
                  duration={animationDuration}
                />
              )}
              명
            </div>
            <div style={dataStyle}>
              <img
                width={50}
                height={50}
                src="/img/memo.png"
                alt="이미지를 표시할수 없습니다!"
              />
              <div style={dataHeaderStyle}>저장된 자소서</div>
              {inView && (
                <CountUp
                  start={0}
                  end={totalResume}
                  duration={animationDuration}
                />
              )}
              개
            </div>
            <div style={dataStyle}>
              <img
                width={50}
                height={50}
                src="/img/graph.png"
                alt="이미지를 표시할수 없습니다!"
              />
              <div style={dataHeaderStyle}>총 방문자</div>
              {inView && (
                <CountUp
                  start={0}
                  end={totalVisitor}
                  duration={animationDuration}
                />
              )}
              명
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingStat;
