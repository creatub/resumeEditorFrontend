import {
  Button,
  Form,
  Input,
  Radio,
  Tooltip,
  Modal,
  Table,
  Select,
} from 'antd';
import {
  InfoCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import PuffLoader from 'react-spinners/PuffLoader';
import { DecodedToken } from '@/types/globalTypes';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axiosInstance from '@/api/api';
import React from 'react';
import { TableData, TableColumns } from './tableData';
import useModal from '@/hooks/useModal';
import LoadingSpinner from '@/components/loadlingSpinner';

const Recommendation = () => {
  const [userInputForm] = useForm();
  const [generated, setGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [certList, setCertList] = useState([{ value: '', iconType: 'plus' }]);
  const [awardList, setAwardList] = useState([{ value: '', iconType: 'plus' }]);
  const [experienceList, setExperienceList] = useState([
    { value: '', iconType: 'plus' },
  ]);
  const {
    isOpen: isOccupationModalOpen,
    open: openOccupationModal,
    close: closeOccupationModal,
  } = useModal();
  const [occupationSearchResults, setOccupationSearchResults] = useState([]);
  const [occupationSearchLoading, setOccupationSearchLoading] = useState(false);
  const [occupationSearchError, setOccupationSearchError] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');

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
            const formattedAwards = awards.split('\n').map((award, index) => ({
              value: award,
              iconType: index === 0 ? 'plus' : 'minus',
            }));
            setAwardList(formattedAwards);
          }
          if (experiences) {
            const formattedExperiences = experiences
              .split('\n')
              .map((exp, index) => ({
                value: exp,
                iconType: index === 0 ? 'plus' : 'minus',
              }));
            setExperienceList(formattedExperiences);
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

  const onFinish = ({ career, education, keyword, minPay, maxPay }) => {
    let res = axios
      .get('https://resume-editor-python.vercel.app/job_search', {
        params: {
          career: career,
          education: education,
          keyword: keyword,
          minPay: minPay,
          maxPay: maxPay,
        },
      })
      .then((res) => {
        console.log(res);
      });
    setGenerated(true);
  };

  const addQuestion = () =>
    setCertList([...certList, { value: '', iconType: 'minus' }]);
  const removeQuestion = (index) =>
    setCertList(certList.filter((_, i) => i !== index));

  const addAward = () =>
    setAwardList([...awardList, { value: '', iconType: 'minus' }]);
  const removeAward = (index) =>
    setAwardList(awardList.filter((_, i) => i !== index));

  const addExperience = () =>
    setExperienceList([...experienceList, { value: '', iconType: 'minus' }]);
  const removeExperience = (index) =>
    setExperienceList(experienceList.filter((_, i) => i !== index));

  const handleCloseOccupationModal = () => {
    closeOccupationModal();
    setOccupationSearchResults([]);
    setOccupationSearchLoading(false);
    setOccupationSearchError('');
  };

  const handleOccupationSearch = async (value) => {
    setOccupationSearchLoading(true);
    setOccupationSearchError('');

    try {
      const response = await axiosInstance.get(
        `/resume-occupation/load/${value}`
      );
      if (response.data.status === 'Not found') {
        setOccupationSearchError('Not found');
      } else if (response.data.status === 'Success') {
        setOccupationSearchResults(response.data.occupationList);
      }
    } catch (error) {
      setOccupationSearchError('Failed to search');
    } finally {
      setOccupationSearchLoading(false);
    }
  };

  const handleOccupationRowClick = (record) => {
    const { occupation } = record;
    userInputForm.setFieldsValue({ occupation });
    handleCloseOccupationModal();
  };

  const handleChangeSelect = (value: string) => {
    setSelectedEducation(value);
  };

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
  const occupationColumns = [
    {
      title: 'Occupation',
      dataIndex: 'occupation',
      key: 'occupation',
    },
  ];
  const columns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
  ];
  return (
    <div>
      <div
        className="recommendationWrapper"
        style={{ padding: '2%', display: 'flex' }}
      >
        <div
          className="recommendationInnerWrapper"
          style={{
            border: '1px solid rgb(220,220,220)',
            boxShadow: '0 0 10px 0 rgb(220, 220, 220)',
            borderRadius: '5px',
            height: '100%',
            width: '30%',
          }}
        >
          <div
            className="recommendationInputWrapper"
            style={{ padding: '5% 5%' }}
          >
            <Tooltip
              title="회사 추천 서비스는 지원자님의 지난 경험들을 기반으로 알맞는 회사를 추천해 주는 서비스에요!"
              placement="topLeft"
              overlayStyle={{ fontSize: '1rem', maxWidth: '400px' }}
            >
              <InfoCircleOutlined
                style={{
                  fontSize: '15px',
                  top: '10px',
                  bottom: '10px',
                  left: '10px',
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
            <Form layout={'vertical'} form={userInputForm} onFinish={onFinish}>
              <Form.Item
                name="career"
                label={<b>경력</b>}
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                }}
              >
                <Radio.Group>
                  <Radio value="N"> 신입 </Radio>
                  <Radio value="E"> 경력 </Radio>
                  <Radio value="Z"> 관계없음 </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label={<b>지원 직무</b>} name="keyword1">
                <Input
                  suffix={
                    <Button
                      icon={<SearchOutlined />}
                      onClick={() => openOccupationModal()}
                    />
                  }
                  placeholder="직무 이름"
                  size="large"
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Form.Item
                  name="education"
                  label={<b>최종 학력</b>}
                  style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                  }}
                >
                  <Select
                    size="large"
                    defaultValue="00"
                    onChange={handleChangeSelect}
                    options={[
                      { value: '00', label: '학력무관' },
                      { value: '01', label: '초졸이하' },
                      { value: '02', label: '중졸' },
                      { value: '03', label: '고졸' },
                      { value: '04', label: '대졸(2~3년)' },
                      { value: '05', label: '대졸(4년)' },
                      { value: '06', label: '석사' },
                      { value: '07', label: '박사' },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="major"
                  label={<b>학과</b>}
                  style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                    margin: '0 8px',
                  }}
                >
                  <Input size="large" placeholder="전기공학과" />
                </Form.Item>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Form.Item
                  name="minPay"
                  label={<b>최소 연봉</b>}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <Input placeholder="3000만원" size="large" />
                </Form.Item>
                <Form.Item
                  label={<b>최대 연봉</b>}
                  name="maxPay"
                  style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                    margin: '0 8px',
                  }}
                >
                  <Input placeholder="5000만원" size="large" />
                </Form.Item>
              </Form.Item>

              <div>
                <b>자격증</b>
                {certList.map((q, index) => (
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

              <Form.Item style={{ textAlign: 'center', marginTop: '40px' }}>
                <Button
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
          className="rightWrapper"
          style={{ width: '70%', marginLeft: '4%' }}
        >
          <div
            className="adWrapper"
            style={{
              width: '100%',
              border: '1px solid rgb(220,220,220)',
              boxShadow: '0 0 10px 0 rgb(220, 220, 220)',
              borderRadius: '5px',
              marginBottom: '10px',
              height: '14%',
              alignItems: 'center',
              display: 'flex',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              justifyContent: 'center',
            }}
          >
            (주)엔사이트 2058601461 울산 3 전력전자분야구조설계신규인력채용
          </div>
          <div
            className="gptInnerWrapper"
            style={{
              border: '1px solid rgb(220,220,220)',
              boxShadow: '0 0 10px 0 rgb(220, 220, 220)',
              borderRadius: '5px',
              height: generated ? 'auto' : '84.3%',
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
                        {LoadingSpinner()}
                      </div>
                    </div>
                  ) : (
                    <Table dataSource={TableData} columns={TableColumns} />
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
                    추천된 회사 목록이 이곳에 출력돼요!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Search Occupation"
        open={isOccupationModalOpen}
        onCancel={handleCloseOccupationModal}
        footer={null}
        width={600}
      >
        <Input.Search
          placeholder="Search occupation"
          enterButton
          onSearch={handleOccupationSearch}
        />
        {occupationSearchLoading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <PuffLoader color="#36d7b7" size={20} />
          </div>
        ) : occupationSearchError ? (
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>
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
            style={{ marginTop: '20px' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Recommendation;
