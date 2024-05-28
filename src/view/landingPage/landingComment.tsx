import React from "react";

const LandingComment = () => {
  const Comments = [
    {
      icon: "warning",
      comment: "처음 시작이 막막했는데 자기소개서 시작하기가 수월해졌어요!",
      name: "Kim min jae",
    },
    {
      icon: "warning",
      comment: "처음 시작이 막막했는데 자기소개서 시작하기가 수월해졌어요!",
      name: "Kim min jae",
    },
    {
      icon: "warning",
      comment: "처음 시작이 막막했는데 자기소개서 시작하기가 수월해졌어요!",
      name: "Kim min jae",
    },
  ];
  return (
    <div style={{ backgroundColor: "#E2EFFF" }}>
      <div
        style={{
          width: "100%",
          textAlign: "center",
          paddingTop: "5%",
          fontWeight: "bold",
          fontSize: "1.4rem",
        }}
      >
        생생한 후기!
      </div>
      <div className="CommentWrapper" style={{ padding: "5% 15%" }}>
        <div style={{ width: "100%", display: "flex" }}>
          {Comments.map((comment) => {
            return (
              <div
                style={{
                  border: "1px solid rgb(220,220,220)",
                  marginRight: "4%",
                  backgroundColor: "white",
                  borderRadius: "5px",
                  width: "30%",
                  padding: "1%",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div className="commentIcon">{comment.icon}</div>
                  <div>
                    <p>{comment.comment}</p>
                  </div>
                  <div>{comment.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingComment;
