import axiosInstance from '@/api/api';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Table from 'antd/es/table';
import Tooltip from 'antd/es/tooltip';
import Pagination from 'antd/es/pagination';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import React from 'react';
import Swal from 'sweetalert2';
import { Modal } from 'antd';
interface DecodedToken {
  category: string;
  exp: number;
  iat: number;
  role: string;
  uNum: number;
  username: string;
}
interface UserInfo {
  age: number;
  authCode: null;
  birthDate: string;
  company: string;
  delDate: null;
  email: string;
  gender: string;
  inDate: string;
  mode: number;
  occupation: string;
  password: null;
  resumeEditCount: number;
  role: string;
  status: number;
  unum: number;
  username: string;
  wish: string;
}
interface EditRecord {
  mode: number;
  r_num: number;
  title: string;
  w_date: string;
}
interface Bookmark {
  read_num: number;
  rating: number;
  r_num: number;
  title: string;
  w_date: string;
  content: string;
  rating_count: number;
}
interface RingProps {
  mode: number;
}
const Ring: React.FC<RingProps> = ({ mode }) => {
  const text = mode === 2 ? 'Pro' : 'Lite';
  const textSize = 30;
  const circleDiameter = textSize + 6; // Add a bit more to accommodate text
  const ringStyle: React.CSSProperties = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: '50%',
    border: `5px solid #85DAD2`,
    color: 'black', // Text color
    fontSize: '15px', // Font size
  };
  return <div style={ringStyle}>{text}</div>;
};
const MyPage = () => {
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});
  const [userForm] = useForm();
  const [activeTab, setActiveTab] = useState<string>('editHistory');
  const [editRecords, setEditRecords] = useState<EditRecord[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookmarkClicked, setBookmarkClicked] = useState<boolean>(false);
  const [editRecordClicked, setEditRecordClicked] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const fetchUserInfo = () => {
    let res = axiosInstance
      .post('/user/search')
      .then((res) => {
        console.log(res);
        setUserInfo(res.data.response);
        userForm.setFieldsValue({
          username: res.data.response.username,
          age: res.data.response.age,
          email: res.data.response.email,
          gender: res.data.response.gender,
          inDate: res.data.response.inDate.slice(0, 10),
          mode: res.data.response.mode,
          birthDate: res.data.response.birthDate,
          wish: res.data.response.wish,
          resumeEditCount: res.data.response.resumeEditCount,
          company: res.data.response.company,
          occupation: res.data.response.occupation,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchEditRecords = (pageNo: number) => {
    axiosInstance
      .get(`/user/edit-list?pageNo=${pageNo - 1}`)
      .then((res) => {
        if (res.data.response === '게시글이 없습니다.') {
          setEditRecords([]);
        } else {
          setEditRecords(res.data.response);
          setTotalPages(res.data.totalPages);
        }
      })
      .catch((err) => {
        console.log(err);
        setEditRecords([]);
      });
  };

  const onEdit = ({ email, age, birthDate, wish, company, occupation }) => {
    let res = axiosInstance
      .post('/user/update', {
        email: email,
        age: age,
        birthDate: birthDate,
        company: company,
        occupation: occupation,
        wish: wish,
      })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: '수정 완료',
          text: '회원정보가 수정되었습니다.',
        });
        fetchUserInfo();
      });
  };
  const fetchBookmarks = (pageNo: number) => {
    axiosInstance
      .get(`/user/bookmark?pageNo=${pageNo}`)
      .then((res) => {
        if (res.data.response === '게시글이 없습니다.') {
          setBookmarks([]);
        } else {
          setBookmarks(res.data.response);
          setTotalPages(res.data.totalPages);
        }
      })
      .catch((err) => {
        console.log(err);
        setBookmarks([]);
      });
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    if (activeTab === 'editHistory') {
      fetchEditRecords(currentPage);
    } else {
      fetchBookmarks(currentPage);
    }
  }, [activeTab, currentPage]);
  const renderMode = (mode: number) => {
    const modeText = mode === 1 ? 'lite' : 'pro';
    return (
      <div
        style={{
          display: 'inline-block',
          padding: '5px 10px',
          borderRadius: '20px',
          color: 'black',
        }}
      >
        {modeText}
      </div>
    );
  };
  const renderTable = () => {
    if (activeTab === 'editHistory') {
      const columns = [
        { title: 'Mode', dataIndex: 'mode', key: 'mode', render: renderMode },
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (text: string, record: EditRecord) => (
            <a href={`/main/mypage/${record.r_num}`} style={{ color: 'black' }}>
              {text}
            </a>
          ),
        },
        { title: 'Date', dataIndex: 'w_date', key: 'w_date' },
      ];
      return (
        <Table
          dataSource={editRecords.length > 0 ? editRecords : []}
          columns={columns}
          pagination={false}
          rowKey="r_num"
          locale={{ emptyText: '게시글이 없습니다.' }}
        />
      );
    } else {
      const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (text: string, record: Bookmark) => (
            <a href={`./resumelist/${record.r_num}`} style={{ color: 'black' }}>
              {text}
            </a>
          ),
        },
        { title: 'Date', dataIndex: 'w_date', key: 'w_date' },
        { title: 'Rating', dataIndex: 'rating', key: 'rating' },
      ];
      return (
        <Table
          dataSource={bookmarks.length > 0 ? bookmarks : []}
          columns={columns}
          pagination={false}
          rowKey="r_num"
          locale={{ emptyText: '게시글이 없습니다.' }}
        />
      );
    }
  };
  return (
    <div
      className="mypageWrapper"
      style={{ padding: '3% 10%', display: 'flex', width: '80%' }}
    >
      <div className="mypageLeft" style={{ width: '40%', paddingRight: '2%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {userInfo.mode && <Ring mode={userInfo.mode} />}
          <div style={{ flex: 1, marginLeft: '8px' }}>
            <div>{userInfo.username}님</div>
            <div>
              <a
                style={{
                  color: editRecordClicked ? 'black' : 'gray',
                  fontWeight: editRecordClicked ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setActiveTab('editHistory');
                  setEditRecordClicked(true);
                  setBookmarkClicked(false);
                }}
              >
                첨삭 기록
              </a>{' '}
              ·{' '}
              <a
                style={{
                  color: bookmarkClicked ? 'black' : 'gray',
                  fontWeight: bookmarkClicked ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setActiveTab('bookmarks');
                  setBookmarkClicked(true);
                  setEditRecordClicked(false);
                }}
              >
                내 즐겨찾기
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <Tooltip
            title={
              <div style={{ whiteSpace: 'pre-line', maxWidth: '500px' }}>
                회사명으로 검색 : {'\n'}가고자 하는 회사명을 검색해보세요.
                {'\n'}
                직무명으로 검색 : {'\n'}같은 직군의 자소서를 검색해보세요.
                {'\n'}
                키워드로 검색 : {'\n'}작성하고자 하는 키워드를 참고할
                자기소개서를 검색하세요.
              </div>
            }
          >
            <div style={{ color: 'black' }}>
              나에게 맞는 자소서를 검색하는 방법을 알아보세요.
            </div>
          </Tooltip>
        </div>
        {renderTable()}
        <Pagination
          showSizeChanger={false}
          current={currentPage}
          total={totalPages * 10}
          onChange={(pageNo) => setCurrentPage(pageNo)}
          style={{ textAlign: 'center', marginTop: '20px' }}
        />
      </div>
      <div
        className="mypageRight"
        style={{
          width: '60%',
          border: '1px solid rgb(220,220,220)',
          padding: '5%',
          borderRadius: '5px',
        }}
      >
        <div className="myPageContentWrapper">
          <Form onFinish={onEdit} form={userForm}>
            <Form.Item style={{ width: '100%', marginBottom: '0' }}>
              <Form.Item
                name="username"
                label={<b>유저ID</b>}
                style={{ width: 'calc(50% - 8px)', display: 'inline-block' }}
              >
                <Input size="large" disabled />
              </Form.Item>
              <Form.Item
                name="email"
                label={<b>이메일</b>}
                style={{
                  width: 'calc(50% - 8px)',
                  display: 'inline-block',
                  marginLeft: '8px',
                }}
              >
                <Input size="large" disabled />
              </Form.Item>
            </Form.Item>
            <Form.Item style={{ width: '100%', marginBottom: '0' }}>
              <Form.Item
                name="age"
                label={<b>나이</b>}
                style={{ width: 'calc(50% - 8px)', display: 'inline-block' }}
              >
                <Input size="large" disabled />
              </Form.Item>
              <Form.Item
                name="birthDate"
                label={<b>생년월일</b>}
                style={{
                  width: 'calc(50% - 8px)',
                  display: 'inline-block',
                  marginLeft: '8px',
                }}
              >
                <Input size="large" disabled />
              </Form.Item>
            </Form.Item>
            <Form.Item style={{ width: '100%', marginBottom: '0' }}>
              <Form.Item
                name="wish"
                label={<b>목표 직무</b>}
                style={{ width: 'calc(50% - 8px)', display: 'inline-block' }}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="inDate"
                label={<b>가입일</b>}
                style={{
                  width: 'calc(50% - 8px)',
                  display: 'inline-block',
                  marginLeft: '8px',
                }}
              >
                <Input size="large" disabled />
              </Form.Item>
            </Form.Item>

            <Form.Item style={{ width: '100%', marginBottom: '0' }}>
              <Form.Item
                name="company"
                label={<b>회사</b>}
                style={{ width: 'calc(50% - 8px)', display: 'inline-block' }}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="occupation"
                label={<b>직무</b>}
                style={{
                  width: 'calc(50% - 8px)',
                  display: 'inline-block',
                  marginLeft: '8px',
                }}
              >
                <Input size="large" />
              </Form.Item>
            </Form.Item>
            <Form.Item style={{ width: '100%', marginBottom: '0' }}>
              <Form.Item
                name="gender"
                label={<b>성별</b>}
                style={{ width: 'calc(50% - 8px)', display: 'inline-block' }}
              >
                <Input size="large" disabled />
              </Form.Item>
              <Form.Item
                name="resumeEditCount"
                label={<b>첨삭한 자소서수</b>}
                style={{
                  width: 'calc(50% - 8px)',
                  display: 'inline-block',
                  marginLeft: '8px',
                }}
              >
                <Input size="large" disabled />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <div
                className="buttonWrapper"
                style={{
                  marginTop: '5%',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Button
                  htmlType="submit"
                  size="large"
                  style={{
                    backgroundColor: '#85DAD2',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  수정하기
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    setOpenDeleteModal(true);
                  }}
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  회원 탈퇴
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        centered
        open={openDeleteModal}
        closable={false}
        footer={[
          <Button
            style={{
              backgroundColor: '#001529',
              color: 'white',
            }}
            key={'ok'}
            onClick={() => {
              let accessToken = localStorage.getItem('access') ?? '';
              let Decoded: DecodedToken = jwtDecode(accessToken);
              axios
                .post('/user/delete', {
                  unum: Decoded.uNum,
                })
                .then((res) => {
                  Swal.fire({
                    icon: 'success',
                    title: '회원 탈퇴 완료',
                    text: '그동안 이용해주셔서 감사합니다.',
                  }).then(() => {
                    localStorage.clear();
                    window.location.href = '/';
                  });
                });
            }}
          >
            예
          </Button>,
          <Button
            key={'no'}
            onClick={() => {
              setOpenDeleteModal(false);
            }}
          >
            아니오
          </Button>,
        ]}
      >
        <span style={{ fontSize: '1.2rem' }}>
          <b>정말 탈퇴하시겠습니까?</b>
        </span>
      </Modal>
    </div>
  );
};
export default MyPage;
