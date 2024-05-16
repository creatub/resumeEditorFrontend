import axiosInstance from "@/api/api";
import { Table } from "antd";
import { useEffect, useState } from "react";

interface ResumeList {
  page: number;
  rating: number;
  rating_count: number;
  read_num: number;
  rnum: number;
  size: number;
  title: string;
}

const tableColumns = [
  {
    title: "제목",
    dataIndex: "title",
  },
  {
    title: "평점",
    dataIndex: "rating",
  },
  {
    title: "조회수",
    dataIndex: "read_num",
  },
];
const AdminResumeList = () => {
  const [resumeList, setResumeList] = useState<ResumeList[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const fetchResumeList = (page: number) => {
    let res = axiosInstance
      .get("/admin/board/list", {
        params: {
          page: 1,
        },
      })
      .then((res) => {
        let newData = res.data.response.map((data: any, idx) => {
          return {
            ...data,
            key: idx,
          };
        });
        setResumeList(newData);
        setTotalPage(res.data.totalPages);
      });
  };
  useEffect(() => {
    fetchResumeList(0);
  }, []);
  return (
    <div style={{ padding: "2% 5%" }}>
      <Table
        pagination={{
          onChange: (page) => {
            fetchResumeList(page - 1);
          },
          pageSize: 10,
          total: totalPage * 10,
        }}
        dataSource={resumeList}
        columns={tableColumns}
      />
    </div>
  );
};

export default AdminResumeList;
