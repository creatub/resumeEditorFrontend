import axiosInstance from "@/api/api";
import { Button, Table } from "antd";
import { useEffect, useState } from "react";

interface UserList {
  age: number;
  authCode: string;
  birthDate: string;
  company: string | null;
  delDate: string | null;
  email: string;
  gender: string;
  inDate: string;
  mode: number;
  occupation: string | null;
  password: null;
  resumeEditCount: number;
  role: string;
  status: number;
  unum: number;
  username: string;
  wish: string | null;
}

const tableColumns = [
  {
    title: "아이디",
    dataIndex: "username",
  },
  {
    title: "이메일",
    dataIndex: "email",
  },
  {
    title: "성별",
    dataIndex: "gender",
    filters: [
      {
        text: "남성",
        value: "M",
      },
      {
        text: "여성",
        value: "F",
      },
    ],
    onFilter: (value, record) => record.gender.indexOf(value as string) === 0,
  },
  {
    title: "유형",
    dataIndex: "role",
  },
  {
    title: "가입일",
    dataIndex: "inDate",
    sorter: (a, b) =>
      new Date(a.inDate).getTime() - new Date(b.inDate).getTime(),
  },
  {
    title: "삭제일",
    dataIndex: "delDate",
    sorter: (a, b) =>
      new Date(a.delDate).getTime() - new Date(b.delDate).getTime(),
  },
  {
    title: "Action",
    dataIndex: "",
    render: () => <Button>삭제</Button>,
  },
];

const AdminUserList = () => {
  const [userList, setUserList] = useState<UserList[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const fetchUserList = (page: number) => {
    let res = axiosInstance
      .get("/admin/user/list", {
        params: {
          page: page,
        },
      })
      .then((res) => {
        let newData = res.data.response.map((data: any, idx: number) => {
          return {
            ...data,
            key: idx,
            inDate: data.inDate.slice(0, 10),
            delDate: data.inDate.slice(0, 10),
          };
        });
        setUserList(newData);
        setTotalPage(res.data.totalPages);
      });
  };
  useEffect(() => {
    fetchUserList(0);
  }, []);
  return (
    <div style={{ padding: "2% 5%" }}>
      <Table
        pagination={{
          onChange: (page) => {
            fetchUserList(page - 1);
          },
          pageSize: 20,
          total: totalPage * 20,
        }}
        dataSource={userList}
        columns={tableColumns}
      />
    </div>
  );
};

export default AdminUserList;
