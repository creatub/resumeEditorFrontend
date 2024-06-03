import React from "react";
import Marquee from "react-fast-marquee";
import ReviewData from "./reviewData";
import CustomFooter from "@/components/footer";

const LandingReview = () => {
  return (
    <div style={{ height: "100vh", backgroundColor: "#85dad2" }}>
      <div className="Wrapper" style={{ paddingTop: "5%" }}>
        <div
          className="LandingReviewHeader"
          style={{
            width: "100%",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "3rem",
            color: "white",
          }}
        >
          실제 사용자들의 생생한 후기!
        </div>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: "1.2rem",
            marginTop: "2%",
            fontWeight: "bold",
            color: "white",
          }}
        >
          20,000개의 합격 자기소개서 데이터와 AI의 결합으로 취준생들이 반한
          자기소개서 첨삭 전문 서비스!
        </div>
        <div
          className="marqueeWrapper"
          style={{ width: "100%", marginTop: "5%" }}
        >
          <Marquee pauseOnHover={true}>
            {ReviewData.map((data, index) => {
              return (
                <ReviewBox
                  key={`${data} ${index}`}
                  username={data.username}
                  comment={data.comment}
                  avatar={data.avatar}
                />
              );
            })}
          </Marquee>
          <Marquee
            pauseOnHover={true}
            direction="right"
            style={{ marginTop: "5%" }}
          >
            {ReviewData.map((data, index) => {
              return (
                <ReviewBox
                  key={`${data}2 ${index}`}
                  username={data.username}
                  comment={data.comment}
                  avatar={data.avatar}
                />
              );
            })}
          </Marquee>
        </div>
      </div>
      <div style={{ paddingTop: "2%" }}>
        <CustomFooter />
      </div>
    </div>
  );
};

const ReviewBox = ({ username, comment, avatar }) => {
  return (
    <div
      style={{
        width: "15vw",
        height: "20vh",
        backgroundColor: "white",
        marginLeft: "80px",
        borderRadius: "10px",
        padding: "1% 5%",
        border: "1px solid black",
      }}
    >
      <h3>{username}</h3>
      <p>{comment}</p>
    </div>
  );
};
export default LandingReview;
