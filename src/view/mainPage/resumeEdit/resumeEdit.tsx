import React from "react";
import Button from "antd/es/button";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import Switch from "antd/es/switch";
import Tooltip from "antd/es/tooltip";
import { InfoCircleOutlined } from "@ant-design/icons";
import { CSSProperties, useState } from "react";
import { useForm } from "antd/es/form/Form";
import axiosInstance from "@/api/api";
import TextArea from "antd/es/input/TextArea";
import "./resumeEdit.css";
import PacmanLoader from "react-spinners/PacmanLoader";
import PuffLoader from "react-spinners/PuffLoader";
import BounceLoader from "react-spinners/BounceLoader";
import FadeLoader from "react-spinners/FadeLoader";
import { DecodedToken } from "@/types/globalTypes";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const ResumeEdit = () => {
  const [userInputForm] = useForm();
  const [userAnswer, setUserAnser] = useState("");
  const [switchSelected, setSwtichSelected] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [diffResult, setDiffResult] = useState([]); // 추가된 줄
  const [showDiff, setShowDiff] = useState(false); // Diff 결과를 보여줄지 여부를 저장하는 상태

  const randomSpinner = () => {
    const descriptionStyle: CSSProperties = {
      textAlign: "center",
      marginTop: "3%",
    };

    const tipStyle: CSSProperties = {
      fontSize: "0.8rem",
      marginTop: "5%",
    };
    let spinner = [
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PacmanLoader color="#36d7b7" />
        </div>
        <div style={descriptionStyle}>
          PRO모드는 LITE모드 보다 정교한 첨삭이 이루어지는
          <br /> 대신 게시판에 업로드가 됩니다
        </div>
        <div style={tipStyle}>
          Tip. 자기소개서에는 특별한 경험을 녹여낼 수록 좋아요.{" "}
        </div>
      </div>,
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PuffLoader color="#36d7b7" />
        </div>
        <div style={descriptionStyle}>
          Reditor는 Resume Editor의 줄임말입니다!
        </div>
        <div style={tipStyle}>
          Tip. 지나치게 전문적인 용어만 가득한 자기소개서는 읽기 힘들어요.
        </div>
      </div>,
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BounceLoader color="#36d7b7" />
        </div>
        <div style={descriptionStyle}>
          수 만개의 정교한 자기소개서를 기반으로 지원자님의 자기소개서를
          <br /> 더욱 빛나게 해드리는 중입니다!
        </div>
        <div style={tipStyle}>
          Tip. 추상적인 표현보다는 명료한 표현이 좋아요!
        </div>
      </div>,
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FadeLoader color="#36d7b7" />
        </div>
        <div style={descriptionStyle}>
          Reditor에 등록된 높은 평점의 자기소개서는
          <br /> 다시 자기소개서 첨삭AI에 활용돼요.
        </div>
        <div style={tipStyle}>
          Tip. 데이터와 결과를 강조해보세요! 구체적인 숫자가 있을수록 신빙성이
          올라갑니다.
        </div>
      </div>,
    ];

    let randomIndex = Math.floor(Math.random() * spinner.length);

    return spinner[randomIndex];
  };
  //resume resume_detail resume_all_1536
  const onFinish = ({ status, company, occupation, question, answer, pro }) => {
    if (
      status == undefined ||
      company == undefined ||
      question == undefined ||
      answer == undefined ||
      occupation == undefined
    ) {
      Swal.fire({
        icon: "error",
        title: "입력되지 않은 항목이 있습니다.",
        text: "모든 항목을 입력해주세요.",
      });
      return;
    }
    setGenerated(true);
    let mode = 1; // 라이트
    if (pro) {
      mode = 2; // 프로
    }
    let res = axiosInstance
      .post(
        "https://resume-gpt-qdrant.vercel.app/rag_chat",
        {
          status: status,
          company: company,
          occupation: occupation,
          question: question,
          answer: answer,
          model: "gpt-4o",
          collection: "resume_all_1536",
          temperature: 1.2,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setResult(res.data.result);
        setDiffResult(res.data.diff); // 추가
        let accessToken = localStorage.getItem("access") ?? "";
        let DecodedToken: DecodedToken = jwtDecode(accessToken);
        let saveData = axiosInstance
          .post("/resume-edit/upload", {
            company: company,
            occupation: occupation,
            item: question,
            r_content: answer,
            mode: mode,
            u_num: DecodedToken.uNum,
            content: res.data.result,
          })
          .then((res) => {
            console.log(res);
          });
      })
      .catch((err) => {
        setGenerated(false);
        if (err) {
          Swal.fire({
            icon: "error",
            title: "오류가 발생했습니다.",
            text: "다시 시도해 주세요!.",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // 추가된 함수
  const renderDiffResult = () => {
    return diffResult.map((item, index) => {
      if (item[0] === 0) {
        return (
          <span key={index} style={{ color: "black" }}>
            {item[1]}
          </span>
        );
      } else if (item[0] === -1) {
        return (
          <span
            key={index}
            style={{
              color: "black",
              backgroundColor: "#FFD6D6",
              textDecoration: "line-through",
            }}
          >
            {item[1]}
          </span>
        );
      } else if (item[0] === 1) {
        return (
          <span
            key={index}
            style={{ color: "black", backgroundColor: "#D4F7DC" }}
          >
            {item[1]}
          </span>
        );
      }
      return null;
    });
  };
  return (
    <div className="Wrapper" style={{ padding: "5% 5%", display: "flex" }}>
      <div
        className="userInnerWrapper"
        style={{
          border: "1px solid rgb(220,220,220)",
          boxShadow: "0 0 10px 0 rgb(220, 220, 220)",
          borderRadius: "5px",
          height: "100%",
          width: "50%",
        }}
      >
        <div className="userInputWrapper" style={{ padding: "5% 5%" }}>
          <Form layout={"vertical"} form={userInputForm} onFinish={onFinish}>
            <Form.Item>
              <Form.Item
                name="status"
                label={<b>신입/경력</b>}
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <Radio.Group>
                  <Radio value="신입"> 신입 </Radio>
                  <Radio value="경력"> 경력 </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="pro"
                label={
                  <div>
                    <Tooltip
                      placement="top"
                      title={
                        <div>
                          <p>PRO는 더 좋은 결과를 제공하지만</p>
                          <p>자소서 목록에 공유됩니다</p>
                        </div>
                      }
                    >
                      <InfoCircleOutlined style={{ marginRight: "3px" }} />
                    </Tooltip>
                    <b>PRO/LITE</b>
                  </div>
                }
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0 8px",
                }}
              >
                <Switch
                  checkedChildren={<b>PRO</b>}
                  unCheckedChildren={<b>LITE</b>}
                  onChange={() => {
                    setSwtichSelected(!switchSelected);
                  }}
                  style={
                    switchSelected
                      ? { backgroundColor: "#85DAD2" }
                      : { backgroundColor: "rgb(220,220,220)" }
                  }
                />
              </Form.Item>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item
                name="company"
                label={<b>지원 회사</b>}
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <Input placeholder="회사 이름" size="large" />
              </Form.Item>
              <Form.Item
                label={<b>지원 직무</b>}
                name="occupation"
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0 8px",
                }}
              >
                <Input placeholder="직무 이름" size="large" />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label={
                <div>
                  <b>자소서 문항</b>
                </div>
              }
              name="question"
            >
              <Input placeholder="자소서 문항을 입력해 주세요" size="large" />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "0" }}
              name="answer"
              label={<b>첨삭할 자소서 내용</b>}
            >
              <TextArea
                placeholder="지원자님의 자소서 내용을 입력해 주세요"
                rows={15}
                maxLength={2000}
                onChange={(e) => {
                  setUserAnser(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {userAnswer.length} / 2000
              </div>
            </Form.Item>
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => {
                  setIsLoading(true);
                }}
                style={{
                  backgroundColor: "#85DAD2",
                  color: "white",
                  fontWeight: "bold",
                }}
                size="large"
                htmlType="submit"
              >
                자소서 첨삭하기
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div
        className="gptInnerWrapper"
        style={{
          border: "1px solid rgb(220,220,220)",
          boxShadow: "0 0 10px 0 rgb(220, 220, 220)",
          borderRadius: "5px",
          height: document.querySelector(".userInnerWrapper")?.clientHeight,
          width: "50%",
          marginLeft: "4%",
        }}
      >
        <div
          className="gptResultWrapper"
          style={{ padding: "5% 5%", height: "100%" }}
        >
          <div className="gptResult" style={{ height: "100%" }}>
            {generated ? (
              isLoading ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                  >
                    {randomSpinner()}
                  </div>
                </div>
              ) : (
                <div>
                  {!showDiff ? (
                    <div>
                      <p
                        style={{
                          whiteSpace: "pre-wrap",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      >
                        {result}
                      </p>
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        글자수:{result.length}
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          size="large"
                          onClick={() => setShowDiff(true)}
                          style={{
                            backgroundColor: "#85DAD2",
                            color: "white",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          달라진점 확인하기!
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      >
                        {renderDiffResult()}
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          size="large"
                          onClick={() => setShowDiff(false)}
                          style={{
                            backgroundColor: "#85DAD2",
                            color: "white",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          원본 결과 보기
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                }}
              >
                Reditor가 답변을 기다리고 있어요!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEdit;
