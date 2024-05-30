import axiosInstance from "@/api/api";
import { Button, Input, Select, Table, Space } from "antd";
import React, { useEffect, useState } from "react";

const { Search } = Input;

interface UserList {
  age: number;
  authCode: string;
  birthDate: string;
  company: string | null;
  delDate: string;
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
const dropDownOptions = [
  {
    value: "username",
    label: "유저아이디",
  },
  {
    value: "email",
    label: "이메일",
  },
  {
    value: "company",
    label: "회사",
  },
  {
    value: "occupation",
    label: "직업",
  },
  {
    value: "wish",
    label: "희망직종",
  },
];

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
    render: () => <Button onClick={(e) => console.log(e)}>삭제</Button>,
  },
];

const AdminUserList = () => {
  const [userList, setUserList] = useState<UserList[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [searchOption, setSearchOption] = useState("");

  const onSearch = (search: string) => {
    if (searchOption === "") {
      alert("검색 옵션을 선택해주세요");
      return;
    } else {
      let res = axiosInstance
        .get("/admin/user/search", {
          params: {
            page: 0,
            keyword: search,
            group: searchOption,
          },
        })
        .then((res) => {
          let newData = res.data.response.map((data: any, idx: number) => {
            return {
              ...data,
              key: idx,
              inDate: data.inDate.slice(0, 10),
              delDate: data.delDate ? data.delDate.slice(0, 10) : null,
            };
          });
          setUserList(newData);
          setTotalPage(res.data.totalPages);
        });
    }
  };
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
            delDate: data.delDate ? data.delDate.slice(0, 10) : null,
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "3%",
        }}
      >
        <Space.Compact style={{ width: "50%" }}>
          <Select
            onChange={(e) => setSearchOption(e as string)}
            size="large"
            defaultValue="검색 옵션"
            options={dropDownOptions}
          />
          <Search size="large" onSearch={onSearch} />
        </Space.Compact>
      </div>
      <Table
        pagination={{
          onChange: (page) => {
            fetchUserList(page - 1);
          },
          pageSize: 20,
          total: totalPage * 20,
        }}
        onChange={(e) => console.log(e)}
        dataSource={userList}
        columns={tableColumns}
      />
    </div>
  );
};

export default AdminUserList;
