import { Button, DatePicker, Form, Input, Radio, Select, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { Link } from "react-router-dom";
import CustomFooter from "../../components/footer";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface signUpParameter {
  email: string;
  password: string;
  username?: string;
  userBirthDate?: string;
  age: number;
  gender: string;
  company?: string;
  occupation?: string;
  wish?: string;
  status: number;
}

const SignUp = () => {
  let [submitForm] = useForm();
  const [userAge, setUserAge] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(-1);
  const onSubmitForm = async ({
    email,
    password,
    gender,
    userBirthDate,
    username,
    age,
    company,
    wish,
    occupation,
    status,
  }) => {
    let birthdate = `${userBirthDate.get("year")}-${
      userBirthDate.get("month") + 1
    }-${userBirthDate.get("date")}`;
    let role = "user";
    let name = "user";
    let nickname = "왜이쒸";
    console.log(email, password, username, gender, age, wish, status);
    try {
      let response = await axios.post("/signup", {
        email,
        password,
        username,
        birthdate,  
        role,
        name,
        nickname,
        gender,
        age,
        wish,
        status,
      });
      if (response) {
        Swal.fire({
          icon: "success",
          title: "회원가입이 완료되었습니다!",
          showConfirmButton: true,
          timer: 1500,
        });
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ marginTop: "5vh" }}>
      <div
        style={{ textAlign: "center", fontWeight: "bold", fontSize: "36px" }}
      >
        Resume Editor
      </div>
      <div
        className="wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          className="signUpWrpper"
          style={{
            width: "40vw",
            height: "80%",
            border: "1px solid rgb(224,224,224)",
            marginTop: "2.5%",
            marginBottom: "5%",
          }}
        >
          <div
            className="signUpInnerWrapper"
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              className="signUpInnerContent"
              style={{ marginTop: "10%", marginBottom: "10%", width: "50%" }}
            >
              <div>
                <span style={{ fontSize: "28px" }}>가입을 환영합니다!</span>
              </div>
              <div
                className="subMessage"
                style={{ color: "rgb(143,143,143)", marginTop: "5%" }}
              >
                <p>고객님에 대해 더 자세히 알아가고 싶어요!</p>
              </div>
              <div>
                <span>이미 계정이 있으신가요?</span>
                <Link
                  className="backToLogin"
                  to="/auth/login"
                  style={{
                    color: "black",
                    marginLeft: "5px",
                    fontWeight: "bold",
                    textDecoration: "underline",
                  }}
                >
                  로그인
                </Link>
              </div>
              <div className="buttonWrapper" style={{ marginTop: "15%" }}>
                <div className="signUpForm">
                  <Form
                    form={submitForm}
                    onFinish={onSubmitForm}
                    layout="vertical"
                    initialValues={{
                      ["gender"]: "성별을 선택해 주세요",
                    }}
                    fields={[{ name: ["age"], value: userAge }]}
                  >
                    <Form.Item
                      label={<b>이메일</b>}
                      name="email"
                      style={{ marginBottom: "3%" }}
                      rules={[
                        () => ({
                          validator(_, value) {
                            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            let emailCheck = emailRegex.test(value);
                            if (!value) {
                              return Promise.reject(
                                new Error("이메일을 입력해 주세요!")
                              );
                            } else if (!emailCheck) {
                              return Promise.reject(
                                new Error("이메일 형식을 확인해 주세요!")
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input size="large" placeholder="이메일 입력" />
                    </Form.Item>
                    <Form.Item
                      label={<b>비밀번호</b>}
                      style={{ marginBottom: "3%" }}
                      name="password"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            let pattern = /[!@#$%^&*()]/;
                            let patternCheck = pattern.test(value);
                            if (!value) {
                              return Promise.reject(
                                new Error("비밀 번호를 입력해 주세요!")
                              );
                            } else if (!patternCheck) {
                              return Promise.reject(
                                new Error("특수문자를 포함해 주세요!")
                              );
                            } else if (value.length < 8) {
                              return Promise.reject(
                                new Error("비밀번호는 8자 이상이어야 합니다!")
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        size="large"
                        type="password"
                        placeholder="비밀번호 입력"
                      />
                    </Form.Item>
                    <Form.Item
                      label={<b>비밀번호 확인</b>}
                      style={{ marginBottom: "3%" }}
                      name="passwordConfirm"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("비밀 번호를 확인해 주세요!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input
                        size="large"
                        type="password"
                        placeholder="비밀번호 확인"
                      />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: "0" }}>
                      <Form.Item
                        label={<b>이름</b>}
                        name="username"
                        style={{
                          display: "inline-block",
                          width: "calc(50% - 8px)",
                        }}
                      >
                        <Input size="large" placeholder="이름" />
                      </Form.Item>
                      <Form.Item
                        label={<b>성별</b>}
                        name="gender"
                        style={{
                          margin: "0 8px",

                          display: "inline-block",
                          width: "calc(50% - 8px)",
                        }}
                      >
                        <Select size="large">
                          <Select.Option value="M" label="남성">
                            남성
                          </Select.Option>
                          <Select.Option value="F" label="여성">
                            여성
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: "0" }}>
                      <Form.Item
                        label={<b>생년월일</b>}
                        name="userBirthDate"
                        style={{
                          display: "inline-block",
                          width: "calc(50% - 8px)",
                        }}
                      >
                        <DatePicker
                          size="large"
                          onChange={(date) => {
                            let age = new Date().getFullYear() - date.year();
                            setUserAge(age);
                            setTimeout(() => {});
                          }}
                          placeholder="2024-01-01"
                        />
                      </Form.Item>
                      <Form.Item
                        label={<b>나이</b>}
                        name="age"
                        style={{
                          margin: "0 8px",
                          display: "inline-block",
                          width: "calc(50% - 8px)",
                        }}
                      >
                        <Input size="large" disabled />
                      </Form.Item>
                    </Form.Item>
                    <Form.Item
                      label={<b>현재 어떤 상태 이신가요?</b>}
                      name="status"
                    >
                      <Radio.Group
                        size="large"
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <Radio value={1}>이직중</Radio>
                        <Radio value={2}>취준중</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      label={<b>회사</b>}
                      name="company"
                      style={{ marginBottom: "3%" }}
                    >
                      {selectedStatus == 1 ? (
                        <Input size="large" placeholder="회사" />
                      ) : (
                        <Input size="large" placeholder="회사" disabled />
                      )}
                    </Form.Item>
                    <Form.Item
                      label={<b>직종</b>}
                      name="occupation"
                      style={{ marginBottom: "3%" }}
                    >
                      {selectedStatus == 1 ? (
                        <Select size="large" placeholder="직종을 선택해 주세요">
                          <Select.Option value="개발자">개발자</Select.Option>
                          <Select.Option value="전문직">전문직</Select.Option>
                          <Select.Option value="생산직">생산직</Select.Option>
                        </Select>
                      ) : (
                        <Select
                          size="large"
                          placeholder="직종을 선택해 주세요"
                          disabled
                        ></Select>
                      )}
                    </Form.Item>
                    <Form.Item label={<b>이직/취업 희망분야</b>} name="wish">
                      <Input size="large" placeholder="회사" />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        htmlType="submit"
                        size="large"
                        style={{
                          width: "100%",
                          backgroundColor: "rgb(32,201,151)",
                          color: "white",
                        }}
                      >
                        회원가입
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomFooter />
    </div>
  );
};

export default SignUp;
