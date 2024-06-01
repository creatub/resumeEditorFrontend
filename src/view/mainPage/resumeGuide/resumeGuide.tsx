import { Button, Form, Input, Radio, Tooltip } from 'antd';
import {
  InfoCircleOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { CSSProperties, useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import PacmanLoader from 'react-spinners/PacmanLoader';
import PuffLoader from 'react-spinners/PuffLoader';
import BounceLoader from 'react-spinners/BounceLoader';
import { DecodedToken } from '@/types/globalTypes';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axiosInstance from '@/api/api';

const ResumeEdit = () => {
  const [userInputForm] = useForm();
  const [generated, setGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [questionList, setQuestionList] = useState([
    { value: '', iconType: 'plus' },
  ]);
  const [awardList, setAwardList] = useState([{ value: '', iconType: 'plus' }]);
  const [experienceList, setExperienceList] = useState([
    { value: '', iconType: 'plus' },
  ]);

  useEffect(() => {
    const accessToken = localStorage.getItem('access') ?? '';
    const decodedToken: DecodedToken = jwtDecode(accessToken);
    const uNum = decodedToken.uNum;

    axiosInstance
      .get(`/resume-guide/load/${uNum}`)
      .then((res) => {
        if (res.data.status === 'Success') {
          const { awards, experiences } = res.data;
          if (awards) {
            const formattedAwards = awards.split('\n').map((award) => ({
              value: award,
              iconType: 'minus',
            }));
            setAwardList([...formattedAwards, { value: '', iconType: 'plus' }]);
          }
          if (experiences) {
            const formattedExperiences = experiences.split('\n').map((exp) => ({
              value: exp,
              iconType: 'minus',
            }));
            setExperienceList([
              ...formattedExperiences,
              { value: '', iconType: 'plus' },
            ]);
          }
        } else if (res.data.status === 'Error') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.data.message,
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Failed to connect to the server. Please try again later.',
        });
      });
  }, []);

  const randomSpinner = () => {
    const descriptionStyle: CSSProperties = {
      textAlign: 'center',
      marginTop: '3%',
    };

    const tipStyle: CSSProperties = {
      fontSize: '0.5rem',
      marginTop: '5%',
    };
    let spinner = [
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PacmanLoader color="#36d7b7" size={10} />
        </div>
        <div style={descriptionStyle}>
          가이드받은 내용을 토대로 나만의 자기소개서를 만들어보세요
        </div>
        <div style={tipStyle}>
          Tip. 자기소개서에는 특별한 경험을 녹여낼 수록 좋아요.{' '}
        </div>
      </div>,
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PuffLoader color="#36d7b7" size={20} />
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BounceLoader color="#36d7b7" size={20} />
        </div>
        <div style={descriptionStyle}>
          수 만개의 자기소개서를 기반으로 가이드를 생성 중입니다!
        </div>
        <div style={tipStyle}>
          Tip. 추상적인 표현보다는 명료한 표현이 좋아요!
        </div>
      </div>,
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BounceLoader color="#36d7b7" size={20} />
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

  const onFinish = ({ status, company, occupation }) => {
    const questions = questionList.filter((q) => q.value.trim() !== '');
    const awards = awardList.filter((a) => a.value.trim() !== '');
    const experiences = experienceList.filter((e) => e.value.trim() !== '');

    if (
      status === undefined ||
      company === undefined ||
      occupation === undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: '입력되지 않은 항목이 있습니다.',
        text: '모든 항목을 입력해주세요.',
      });
      return;
    }

    if (questions.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '입력되지 않은 항목이 있습니다.',
        text: '질문을 한 개 이상 입력해주세요.',
      });
      return;
    }

    if (awards.length === 0 && experiences.length === 0) {
      Swal.fire({
        icon: 'error',
        title: '입력되지 않은 항목이 있습니다.',
        text: '수상경력/직무경험을 한 개 이상 작성해주세요.',
      });
      return;
    }

    setGenerated(true);
    setIsLoading(true);

    const formattedQuestions = questions.map((q, index) => ({
      [`question${index + 1}`]: q.value,
    }));
    const formattedAwards = awards.map((a, index) => ({
      [`award${index + 1}`]: a.value,
    }));
    const formattedExperiences = experiences.map((e, index) => ({
      [`experience${index + 1}`]: e.value,
    }));

    const accessToken = localStorage.getItem('access') ?? '';
    const decodedToken: DecodedToken = jwtDecode(accessToken);
    const uNum = decodedToken.uNum;
    const axiosInstance_python = axios.create({
      baseURL: 'https://resume-gpt-qdrant.vercel.app',
      timeout: 100000,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    axiosInstance
      .post(
        '/resume-guide/upload',
        {
          uNum,
          awards: awards.map((a) => a.value).join('\n'), // 배열을 문자열로 변환하여 전송
          experiences: experiences.map((e) => e.value).join('\n'), // 배열을 문자열로 변환하여 전송
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((uploadRes) => {
        axiosInstance_python
          .post(
            '/resume_guide',
            {
              status: status,
              company: company,
              occupation: occupation,
              questions: formattedQuestions,
              awards: formattedAwards,
              experiences: formattedExperiences,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res.data.status === 'Success') {
              setIsLoading(false);
              setResult(res.data.result);
            }
          })
          .catch((err) => {
            console.log(
              company,
              occupation,
              questions,
              formattedAwards,
              formattedExperiences
            );
            console.log(err);
            setIsLoading(false);
            Swal.fire({
              icon: 'error',
              title: 'Network Error',
              text: 'Failed to connect to the server. Please try again later.',
            });
          });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Failed to connect to the server. Please try again later.',
        });
      });
  };

  const addQuestion = () =>
    setQuestionList([...questionList, { value: '', iconType: 'minus' }]);
  const removeQuestion = (index) =>
    setQuestionList(questionList.filter((_, i) => i !== index));

  const addAward = () =>
    setAwardList([...awardList, { value: '', iconType: 'minus' }]);
  const removeAward = (index) =>
    setAwardList(awardList.filter((_, i) => i !== index));

  const addExperience = () =>
    setExperienceList([...experienceList, { value: '', iconType: 'minus' }]);
  const removeExperience = (index) =>
    setExperienceList(experienceList.filter((_, i) => i !== index));

  const handleInputChange = (e, index, list, setList) => {
    const newValue = e.target.value;
    if (newValue.includes('\n')) {
      const splitValues = newValue.split('\n');
      const newList = [...list];
      newList[index].value = splitValues[0];
      const additionalItems = splitValues
        .slice(1)
        .map((value) => ({ value, iconType: 'minus' }));
      setList([...newList, ...additionalItems]);
    } else {
      const newList = [...list];
      newList[index].value = newValue;
      setList(newList);
    }
  };

  return (
    <div style={{ padding: '5% 5%' }}>
      <div className="Wrapper" style={{ padding: '2% 5%', display: 'flex' }}>
        <div
          className="userInnerWrapper"
          style={{
            border: '1px solid rgb(220,220,220)',
            boxShadow: '0 0 10px 0 rgb(220, 220, 220)',
            borderRadius: '5px',
            height: '100%',
            width: '55%',
          }}
        >
          <div className="userInputWrapper" style={{ padding: '5% 5%' }}>
            <Form layout={'vertical'} form={userInputForm} onFinish={onFinish}>
              <Form.Item
                name="status"
                label={<b>신입/경력</b>}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              >
                <Radio.Group>
                  <Radio value="신입"> 신입 </Radio>
                  <Radio value="경력"> 경력 </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Form.Item
                  name="company"
                  label={<b>지원 회사</b>}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <Input placeholder="회사 이름" size="large" />
                </Form.Item>
                <Form.Item
                  label={<b>지원 직무</b>}
                  name="occupation"
                  style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                    margin: '0 8px',
                  }}
                >
                  <Input placeholder="직무 이름" size="large" />
                </Form.Item>
              </Form.Item>

              <div>
                <b>자소서 문항</b>
                {questionList.map((q, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    {q.iconType === 'plus' ? (
                      <PlusOutlined
                        onClick={addQuestion}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <MinusOutlined
                        onClick={() => removeQuestion(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                    <Input
                      style={{ marginLeft: '8px' }}
                      value={q.value}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          index,
                          questionList,
                          setQuestionList
                        )
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
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    {a.iconType === 'plus' ? (
                      <PlusOutlined
                        onClick={addAward}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <MinusOutlined
                        onClick={() => removeAward(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                    <Input
                      style={{ marginLeft: '8px' }}
                      value={a.value}
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
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    {e.iconType === 'plus' ? (
                      <PlusOutlined
                        onClick={addExperience}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <MinusOutlined
                        onClick={() => removeExperience(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                    <Input
                      style={{ marginLeft: '8px' }}
                      value={e.value}
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

              <Form.Item style={{ textAlign: 'center', marginTop: '40px' }}>
                <Button
                  onClick={() => {
                    setIsLoading(true);
                  }}
                  style={{ backgroundColor: '#85dad2' }}
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
          className="gptInnerWrapper"
          style={{
            border: '1px solid rgb(220,220,220)',
            boxShadow: '0 0 10px 0 rgb(220, 220, 220)',
            borderRadius: '5px',
            height: document.querySelector('.userInnerWrapper')?.clientHeight,
            width: '50%',
            marginLeft: '4%',
          }}
        >
          <div
            className="gptResultWrapper"
            style={{ padding: '5% 5%', height: '100%' }}
          >
            <div className="gptResult" style={{ height: '100%' }}>
              {generated ? (
                isLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                      }}
                    >
                      {randomSpinner()}
                    </div>
                  </div>
                ) : (
                  <p
                    style={{
                      whiteSpace: 'pre-wrap',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}
                  >
                    {result}
                  </p>
                )
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                  }}
                >
                  자기소개서 가이드가 이 곳에 출력돼요!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEdit;
