import { Button, Form, Input } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";

// {
//     "model":"gpt-3.5-turbo",
//     "messages":[
//         {
//             "role":"system",
//             "content":"너는 자기소개서 첨삭 전문가야. 지금부터 자기소개를 첨삭하고 첨삭된 스크립트만 그대로 출력해"
//         },
//         {
//             "role":"user",
//             "content":JSON.stringify(자기소개서 원본 file 내용)
//         }
//     ]
// }
const ResumeEdit = () => {
  useEffect(() => {});
  return (
    <div className="Wrapper" style={{ padding: "2% 7%" }}>
      <div
        className="editInnerWrapper"
        style={{ backgroundColor: "rgb(220,220,220)", height: "70vh" }}
      >
        <p></p>
      </div>
    </div>
  );
};

export default ResumeEdit;
