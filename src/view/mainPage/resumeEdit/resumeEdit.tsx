import {
  Button,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Tooltip,
} from "antd";
import { PlusSquareOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import axiosInstance from "@/api/api";
import TextArea from "antd/es/input/TextArea";
import "./resumeEdit.css";

const { Option } = Select;

const ResumeEdit = () => {
  useEffect(() => {
    let res = axiosInstance
      .post(
        "http://resume-gpt-qdrant.vercel.app/rag_chat",
        {
          status: "신입",
          company: "펄어비스",
          occupation: "프론트엔드 개발자",
          question:
            "펄어비스 및 해당 직무를 지원한 이유와 회사에서 이루고 싶은 일을 작성해 주세요",
          answer:
            "게임은 사람들에게 가장 친근하게 다가갈 수 있는 소프트웨어인 만큼 사용자들의 피드백이 빠르다고 생각합니다. 긍정적인 반응은 제가 개발을 하는 원동력이며 부정적인 반응은 제가 나아갈 방향을 알려주는 이정표가 된다고 생각합니다. 그렇기에 빠르게 사용자 반응을 살필 수 있는 직무에서 근무한다면 그만큼 빠르게 성장할 수 있을 거 같아 지원하였습니다. 두 번째 이유는 제가 쌓아온 경험을 기반으로 기여할수 있는 부분이 있다고 믿기 때문입니다. 저는 3개월간의 인턴십과 5개월간의 부트캠프 경험을 통해 UI구현 뿐만 아니라 API 와 DB 구축에도 참여하며 개발 경험을 쌓았습니다. 또한 다른 사람들과 같이 개발하며 다양한 협업 도구를 활용한 협업 능력 역시 키울 수 있었습니다. 마지막으로 펄어비스는 해외 매출 비중이 77%를 차지하는 글로벌 회사입니다. 저의 다년간의 해외경험은 해외 오피스와 협력하며 다양한 프로젝트를 효과적으로 수행하는 데 큰 자산이 될 것입니다.만약 제가 입사하게 된다면 게임 내 미니게임 컨텐츠를 제작해 보고 싶습니다. 게임을 즐기다 보면 간혹 어려운 메인 컨텐츠에 가로막혀 좌절했던것 같습니다. 이때 게임 내의 이벤트를 통한 보상을 통해 다음 컨텐츠로 나아갈수 있게 되었을때 큰 희열을 느꼇던것 같습니다.펄어비스의 프론트엔드 개발자로서 인게임 컨텐츠 제작을 통해 사용자들에게 최고의 사용자 경험을 제공하고 싶습니다.",
          model: "gpt-4o",
          temperature: 0.8,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  });

  const [userInputForm] = useForm();
  const [userAnswer, setUserAnser] = useState("");
  const [switchSelected, setSwtichSelected] = useState(false);
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
          <Form layout={"vertical"} form={userInputForm}>
            <Form.Item>
              <Form.Item
                label={<b>신입/경력</b>}
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <Radio.Group>
                  <Radio value="신입"> 신입 </Radio>
                  <Radio value="경력"> 경력 </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
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
                    <b>PRO/BASIC</b>
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
                  unCheckedChildren={<b>BASIC</b>}
                  onChange={() => {
                    setSwtichSelected(!switchSelected);
                    console.log(switchSelected);
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
                label={<b>지원 회사</b>}
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <Input placeholder="회사 이름" size="large" />
              </Form.Item>
              <Form.Item
                label={<b>지원 직무</b>}
                name="month"
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
                style={{
                  backgroundColor: "#85DAD2",
                  color: "white",
                  fontWeight: "bold",
                }}
                size="large"
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
        <div className="gptResultWrapper" style={{ padding: "5% 5%" }}>
          <div
            className="gptResultHeader"
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            AI가 여러분의 답변을 기다리고 있어요!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEdit;
