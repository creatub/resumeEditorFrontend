import {
  Button,
  Form,
  Input,
  Radio,
  Tooltip,
  Modal,
  Table,
  Select,
} from "antd";
import {
  InfoCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { CSSProperties, useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import PuffLoader from "react-spinners/PuffLoader";
import BounceLoader from "react-spinners/BounceLoader";
import FadeLoader from "react-spinners/FadeLoader";
import { DecodedToken } from "@/types/globalTypes";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axiosInstance from "@/api/api";
import React from "react";
import { TableData, TableColumns } from "./tableData";

const Recommendation = () => {
  const [userInputForm] = useForm();
  const [generated, setGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [certList, setCertList] = useState([{ value: "", iconType: "plus" }]);
  const [awardList, setAwardList] = useState([{ value: "", iconType: "plus" }]);
  const [experienceList, setExperienceList] = useState([
    { value: "", iconType: "plus" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isOccupationModalOpen, setIsOccupationModalOpen] = useState(false);
  const [occupationSearchResults, setOccupationSearchResults] = useState([]);
  const [occupationSearchLoading, setOccupationSearchLoading] = useState(false);
  const [occupationSearchError, setOccupationSearchError] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");

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
          가이드받은 내용을 토대로 나만의 자기소개서를 만들어보세요
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
          Tip. 자소서를 쓰기 전에 내세울 수 있는 나의 경험을 정리하면
          <br />
          훨씬 좋은 자소서를 쓸 수 있어요!
        </div>
      </div>,
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BounceLoader color="#36d7b7" />
        </div>
        <div style={descriptionStyle}>
          수 만개의 자기소개서를 기반으로 가이드를 생성 중입니다!
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
          Tip. 자기소개서 목록에서 다른 사람들의 자기소개서도 참고해보세요!
        </div>
      </div>,
    ];

    let randomIndex = Math.floor(Math.random() * spinner.length);

    return spinner[randomIndex];
  };

  const onFinish = ({ career, education, keyword, minPay, maxPay }) => {
    // let res = axios
    //   .get("https://resume-editor-python.vercel.app/job_search", {
    //     params: {
    //       career: career,
    //       education: education,
    //       keyword: keyword,
    //       minPay: minPay,
    //       maxPay: maxPay,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   });
    setGenerated(true);
  };
  const applyStyleToText = (text) => {
    // '*' 개수를 세는 정규 표현식
    const asteriskCount = (text.match(/\*/g) || []).length;
    // '#' 개수를 세는 정규 표현식
    const hashCount = (text.match(/#/g) || []).length;

    // '*' 개수에 따라 스타일 적용
    const style = {
      fontWeight: asteriskCount > 0 ? "bold" : "normal",
      fontSize: asteriskCount > 0 ? "1.1rem" : "1rem",
      color: hashCount > 0 ? "blue" : "inherit",
    };

    return (
      <div>
        <p style={style}>{text.replace(/\*/g, "").replace(/#/g, "")}</p>
      </div>
    );
  };

  const addQuestion = () =>
    setCertList([...certList, { value: "", iconType: "minus" }]);
  const removeQuestion = (index) =>
    setCertList(certList.filter((_, i) => i !== index));

  const addAward = () =>
    setAwardList([...awardList, { value: "", iconType: "minus" }]);
  const removeAward = (index) =>
    setAwardList(awardList.filter((_, i) => i !== index));

  const addExperience = () =>
    setExperienceList([...experienceList, { value: "", iconType: "minus" }]);
  const removeExperience = (index) =>
    setExperienceList(experienceList.filter((_, i) => i !== index));
  const openSearchModal = () => {
    setIsModalOpen(true);
  };

  //추가
  const closeSearchModal = () => {
    setIsModalOpen(false);
    setSearchResults([]);
    setSearchLoading(false);
    setSearchError("");
  };

  const handleSearch = async (value) => {
    setSearchLoading(true);
    setSearchError("");

    try {
      const response = await axiosInstance.get(`/resume-items/load/${value}`);
      if (response.data.status === "Not found") {
        setSearchError("Not found");
      } else if (response.data.status === "Success") {
        setSearchResults(response.data.itemsList);
      }
    } catch (error) {
      setSearchError("Failed to search");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRowClick = (record) => {
    const { company, items } = record;
    const itemList = items.split("||");
    userInputForm.setFieldsValue({ company });
    setCertList(
      itemList.map((item, index) => ({
        value: item,
        iconType: index === 0 ? "plus" : "minus",
      }))
    );
    closeSearchModal();
  };

  const closeOccupationSearchModal = () => {
    setIsOccupationModalOpen(false);
    setOccupationSearchResults([]);
    setOccupationSearchLoading(false);
    setOccupationSearchError("");
  };

  const handleOccupationSearch = async (value) => {
    setOccupationSearchLoading(true);
    setOccupationSearchError("");

    try {
      const response = await axiosInstance.get(
        `/resume-occupation/load/${value}`
      );
      if (response.data.status === "Not found") {
        setOccupationSearchError("Not found");
      } else if (response.data.status === "Success") {
        setOccupationSearchResults(response.data.occupationList);
      }
    } catch (error) {
      setOccupationSearchError("Failed to search");
    } finally {
      setOccupationSearchLoading(false);
    }
  };

  const handleOccupationRowClick = (record) => {
    const { occupation } = record;
    userInputForm.setFieldsValue({ occupation });
    closeOccupationSearchModal();
  };

  const handleChangeSelect = (value: string) => {
    setSelectedEducation(value);
  };

  const handleInputChange = (e, index, list, setList) => {
    const newValue = e.target.value;
    if (newValue.includes("\n")) {
      const splitValues = newValue.split("\n");
      const newList = [...list];
      newList[index].value = splitValues[0];
      const additionalItems = splitValues
        .slice(1)
        .map((value) => ({ value, iconType: "minus" }));
      setList([...newList, ...additionalItems]);
    } else {
      const newList = [...list];
      newList[index].value = newValue;
      setList(newList);
    }
  };
  const occupationColumns = [
    {
      title: "Occupation",
      dataIndex: "occupation",
      key: "occupation",
    },
  ];
  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
    },
  ];
  return (
    <div>
      <div className="Wrapper" style={{ padding: "2%", display: "flex" }}>
        <div
          className="userInnerWrapper"
          style={{
            border: "1px solid rgb(220,220,220)",
            boxShadow: "0 0 10px 0 rgb(220, 220, 220)",
            borderRadius: "5px",
            height: "100%",
            width: "30%",
          }}
        >
          <div className="userInputWrapper" style={{ padding: "5% 5%" }}>
            <Tooltip
              title="회사 추천 서비스는 지원자님의 지난 경험들을 기반으로 알맞는 회사를 추천해 주는 서비스에요!"
              placement="topLeft"
              overlayStyle={{ fontSize: "1rem", maxWidth: "400px" }}
            >
              <InfoCircleOutlined
                style={{
                  fontSize: "15px",
                  top: "10px",
                  bottom: "10px",
                  left: "10px",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Form layout={"vertical"} form={userInputForm} onFinish={onFinish}>
              <Form.Item
                name="career"
                label={<b>경력</b>}
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                }}
              >
                <Radio.Group>
                  <Radio value="N"> 신입 </Radio>
                  <Radio value="E"> 경력 </Radio>
                  <Radio value="Z"> 관계없음 </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label={<b>지원 직무</b>} name="keyword1">
                <Input size="large" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Form.Item
                  name="education"
                  label={<b>최종 학력</b>}
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 8px)",
                  }}
                >
                  <Select
                    size="large"
                    defaultValue="00"
                    onChange={handleChangeSelect}
                    options={[
                      { value: "00", label: "학력무관" },
                      { value: "01", label: "초졸이하" },
                      { value: "02", label: "중졸" },
                      { value: "03", label: "고졸" },
                      { value: "04", label: "대졸(2~3년)" },
                      { value: "05", label: "대졸(4년)" },
                      { value: "06", label: "석사" },
                      { value: "07", label: "박사" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="major"
                  label={<b>학과</b>}
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 8px)",
                    margin: "0 8px",
                  }}
                >
                  <Input size="large" placeholder="전기공학과" />
                </Form.Item>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Form.Item
                  name="minPay"
                  label={<b>최소 연봉</b>}
                  style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                >
                  <Input placeholder="3000만원" size="large" />
                </Form.Item>
                <Form.Item
                  label={<b>최대 연봉</b>}
                  name="maxPay"
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 8px)",
                    margin: "0 8px",
                  }}
                >
                  <Input placeholder="8000만원" size="large" />
                </Form.Item>
              </Form.Item>

              <div>
                <b>자격증</b>
                {certList.map((q, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    {q.iconType === "plus" ? (
                      <PlusOutlined
                        onClick={addQuestion}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <MinusOutlined
                        onClick={() => removeQuestion(index)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    <Input
                      style={{ marginLeft: "8px" }}
                      value={q.value}
                      size="large"
                      onChange={(e) =>
                        handleInputChange(e, index, certList, setCertList)
                      }
                    />
                  </div>
                ))}
              </div>

              <div>
                <b>수상 경력</b>
                {awardList.map((a, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    {a.iconType === "plus" ? (
                      <PlusOutlined
                        onClick={addAward}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <MinusOutlined
                        onClick={() => removeAward(index)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    <Input
                      style={{ marginLeft: "8px" }}
                      value={a.value}
                      size="large"
                      onChange={(e) =>
                        handleInputChange(e, index, awardList, setAwardList)
                      }
                    />
                  </div>
                ))}
              </div>

              <div>
                <b>직무 관련 경험</b>
                {experienceList.map((e, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    {e.iconType === "plus" ? (
                      <PlusOutlined
                        onClick={addExperience}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <MinusOutlined
                        onClick={() => removeExperience(index)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    <Input
                      style={{ marginLeft: "8px" }}
                      value={e.value}
                      size="large"
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          index,
                          experienceList,
                          setExperienceList
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              <Form.Item style={{ textAlign: "center", marginTop: "40px" }}>
                <Button
                  style={{ backgroundColor: "#85dad2" }}
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  생성하기
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div
          className="rightWrapper"
          style={{ width: "70%", marginLeft: "4%" }}
        >
          <div
            className="adWrapper"
            style={{
              width: "100%",
              border: "1px solid rgb(220,220,220)",
              boxShadow: "0 0 10px 0 rgb(220, 220, 220)",
              borderRadius: "5px",
              marginBottom: "10px",
              height: "14%",
              alignItems: "center",
              display: "flex",
              fontWeight: "bold",
              fontSize: "1.1rem",
              justifyContent: "center",
            }}
          >
            (주)엔사이트 2058601461 울산 3 전력전자분야구조설계신규인력채용
          </div>
          <div
            className="gptInnerWrapper"
            style={{
              border: "1px solid rgb(220,220,220)",
              boxShadow: "0 0 10px 0 rgb(220, 220, 220)",
              borderRadius: "5px",
              height: generated ? "auto" : "84.3%",
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
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
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
                    <Table dataSource={TableData} columns={TableColumns} />
                  )
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    추천된 회사 목록이 이곳에 출력돼요!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Search Company"
        visible={isModalOpen}
        onCancel={closeSearchModal}
        footer={null}
        width={600}
      >
        <Input.Search
          placeholder="Search company"
          enterButton
          onSearch={handleSearch}
        />
        {searchLoading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <PuffLoader color="#36d7b7" size={20} />
          </div>
        ) : searchError ? (
          <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
            {searchError}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={searchResults}
            rowKey="company"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            pagination={false}
            style={{ marginTop: "20px" }}
          />
        )}
      </Modal>
      <Modal
        title="Search Occupation"
        visible={isOccupationModalOpen}
        onCancel={closeOccupationSearchModal}
        footer={null}
        width={600}
      >
        <Input.Search
          placeholder="Search occupation"
          enterButton
          onSearch={handleOccupationSearch}
        />
        {occupationSearchLoading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <PuffLoader color="#36d7b7" size={20} />
          </div>
        ) : occupationSearchError ? (
          <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
            {occupationSearchError}
          </div>
        ) : (
          <Table
            columns={occupationColumns}
            dataSource={occupationSearchResults}
            rowKey="occupation"
            onRow={(record) => ({
              onClick: () => handleOccupationRowClick(record),
            })}
            pagination={false}
            style={{ marginTop: "20px" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Recommendation;
