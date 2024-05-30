import { Button, Form, Input, Select, Spin, Tooltip } from 'antd';
import {
  InfoCircleOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { CSSProperties, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import axiosInstance from '@/api/api';
import TextArea from 'antd/es/input/TextArea';
import PacmanLoader from 'react-spinners/PacmanLoader';
import PuffLoader from 'react-spinners/PuffLoader';
import BounceLoader from 'react-spinners/BounceLoader';
import { DecodedToken } from '@/types/globalTypes';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

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
          PRO모드는 LITE모드 보다 정교한 첨삭이 이루어지는
          <br /> 대신 게시판에 업로드가 됩니다
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
          Tip. 지나치게 전문적인 용어만 가득한 자기소개서는 읽기 힘들어요.
        </div>
      </div>,
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BounceLoader color="#36d7b7" size={20} />
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BounceLoader color="#36d7b7" size={20} />
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

  const onFinish = ({ company, occupation }) => {
    if (company == undefined || occupation == undefined) {
      Swal.fire({
        icon: 'error',
        title: '입력되지 않은 항목이 있습니다.',
        text: '모든 항목을 입력해주세요.',
      });
      return;
    }
    setGenerated(true);
    setIsLoading(true);

    const questions = questionList.map((q, index) => ({
      [`question${index + 1}`]: q.value,
    }));
    const awards = awardList.map((a, index) => ({
      [`award${index + 1}`]: a.value,
    }));
    const experiences = experienceList.map((e, index) => ({
      [`experience${index + 1}`]: e.value,
    }));

    let res = axiosInstance
      .post(
        'https://resume-gpt-qdrant.vercel.app/resume_guide',
        {
          company: company,
          occupation: occupation,
          questions: questions,
          awards: awards,
          experiences: experiences,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.status === 'Success') {
          setIsLoading(false);
          setResult(res.data.result);
          let accessToken = localStorage.getItem('access') ?? '';
          let DecodedToken: DecodedToken = jwtDecode(accessToken);
        }
      })
      .catch((err) => {
        console.log(company, occupation, questions, awards, experiences);
        console.log(err);
        setIsLoading(false);
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
    <div style={{ padding: '1% 5%' }}>
      <h1 style={{ textAlign: 'center' }}>자기소개서 가이드</h1>
      <div
        className="Wrapper"
        style={{ padding: '2% 5%', display: 'flex', justifyContent: 'center' }}
      >
        <div
          className="userInnerWrapper"
          style={{
            border: '1px solid rgb(220,220,220)',
            boxShadow: '0 0 10px 0 rgb(220, 220, 220)',
            borderRadius: '5px',
            height: '100%',
            width: '90%',
          }}
        >
          <div className="userInputWrapper" style={{ padding: '5% 5%' }}>
            <Form layout={'vertical'} form={userInputForm} onFinish={onFinish}>
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

              <Form.Item
                style={{ marginBottom: '0' }}
                name="guide"
                label={<b>자기소개서 가이드</b>}
              >
                <div
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '2px',
                    padding: '10px',
                    minHeight: '200px', // 기본 크기
                    maxHeight: '600px', // 최대 높이
                    overflowY: 'auto',
                    backgroundColor: '#fafafa',
                    position: 'relative', // randomSpinner와 겹치지 않게 하기 위해 position 속성 추가
                  }}
                >
                  {generated &&
                    (isLoading ? (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          textAlign: 'center',
                        }}
                      >
                        {randomSpinner()}
                      </div>
                    ) : null)}
                  <p>
                    {!isLoading && (result || '이 곳에는 결과가 출력됩니다.')}
                  </p>
                </div>
              </Form.Item>
              <Form.Item>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                ></div>
              </Form.Item>

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
      </div>
    </div>
  );
};

export default ResumeEdit;
