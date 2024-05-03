import CustomFooter from "@/components/footer";
import { Avatar, Button, Divider, Form, Input } from "antd";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  const controls5 = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls1.start({ opacity: 1, scale: 1 });
      await controls2.start({ opacity: 1, scale: 1 });
      await controls3.start({ opacity: 1, scale: 1 });
      await controls4.start({ opacity: 1, scale: 1 });
      await controls5.start({ opacity: 1, scale: 1 });
    };
    sequence();
  }, [controls1, controls2, controls3, controls4, controls5]);

  return (
    <div>
      <div className="wrapper" style={{ display: "flex" }}>
        <div
          className="leftWrapper"
          style={{
            backgroundColor: "#1FC997",
            width: "50%",
            height: "100vh",
          }}
        >
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              color: "white",
              paddingTop: "15%",
              paddingBottom: "15%",
              paddingRight: "15%",
              paddingLeft: "20%",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={controls1}
              transition={{ duration: 0.5 }}
            >
              <h1>
                당신만을 위한 자소서 AI 자소서
                <br /> 컨설턴트!
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={controls2}
              transition={{ duration: 0.5 }}
            >
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Corporis a culpa minima, eos hic ut unde harum impedit esse
                officiis dolorem? Deleniti ut voluptatem est perspiciatis
                obcaecati minus assumenda distinctio.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={controls3}
              transition={{ duration: 0.5 }}
            >
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos
                quas adipisci atque minima maiores, veniam quo doloremque
                doloribus a nostrum. Ratione ex molestiae autem numquam aperiam
                illum praesentium sed quod!
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={controls4}
              transition={{ duration: 0.5 }}
            >
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos
                quas adipisci atque minima maiores, veniam quo doloremque
                doloribus a nostrum. Ratione ex molestiae autem numquam aperiam
                illum praesentium sed quod!
              </p>
            </motion.div>
          </div>
        </div>
        <div
          className="rightWrapper"
          style={{
            height: "100vh",
            width: "50%",
            backgroundColor: "#1FC997",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",

              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={controls5}
              transition={{ duration: 0.5 }}
              style={{
                color: "white",
                width: "55%",
                textAlign: "center",
                fontSize: "36px",
                border: "3px solid white",
                borderRadius: "20px",
              }}
            >
              Resume Editor
            </motion.div>
          </div>
          <div
            className="signUpWrpper"
            style={{
              width: "40vw",
              height: "60%",
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
                className="formWrapper"
                style={{
                  marginTop: "10%",
                  width: "60%",
                  backgroundColor: "white",
                  padding: "5%",
                  border: "1px solid rgb(224,224,224)",
                  borderRadius: "20px",
                }}
              >
                <Form>
                  <Form.Item style={{ marginBottom: "2%" }}>
                    <Input
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="아이디 입력"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="비밀번호 입력"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      style={{
                        width: "100%",
                        color: "white",
                        backgroundColor: "#1FC997",
                        border: "1px solid white",
                        fontWeight: "bold",
                        fontSize: "16px",
                        height: "50px",
                      }}
                    >
                      로그인
                    </Button>
                  </Form.Item>
                </Form>
                <Divider
                  orientation="center"
                  style={{ color: "rgb(200,200,200)" }}
                >
                  또는
                </Divider>
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "#00C73C",
                    color: "white",
                    display: "flex",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    height: "50px",
                  }}
                >
                  <Avatar size={30} src={"/img/naver_icon.png"} />
                  네이버 로그인
                </Button>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    textDecoration: "underline",
                    textDecorationColor: "#1fc997",
                    marginTop: "10px",
                  }}
                >
                  <Link to="/auth/signup">
                    <span
                      style={{
                        color: "#1fc997",
                      }}
                    >
                      회원가입
                    </span>
                  </Link>
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

export default LandingPage;
