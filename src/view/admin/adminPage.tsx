import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { Suspense, useState } from "react";
import AdminUserList from "./adminUserList";
import AdminResumeList from "./adminResumeList";
import axiosInstance from "@/api/api";
import { useNavigate } from "react-router-dom";
import AdminResumeStat from "./adminResumeStat";
import AdminUserStat from "./adminUserStat";

const { Header, Content, Sider } = Layout;

const item3: MenuProps["items"] = [
  {
    key: "userManagement",
    label: <div style={{ color: "black", fontWeight: "bold" }}>회원 관리</div>,
    children: [
      {
        key: "userList",
        label: (
          <div style={{ color: "black", fontWeight: "bold" }}>회원 목록</div>
        ),
      },
      {
        key: "userStatistic",
        label: (
          <div style={{ color: "black", fontWeight: "bold" }}>회원 통계</div>
        ),
      },
    ],
  },
  {
    key: "resumeManagement",
    label: (
      <div style={{ color: "black", fontWeight: "bold" }}>자소서 관리</div>
    ),
    children: [
      {
        key: "resumeList",
        label: (
          <div style={{ color: "black", fontWeight: "bold" }}>자소서 목록</div>
        ),
      },
      {
        key: "resumeStatistic",
        label: (
          <div style={{ color: "black", fontWeight: "bold" }}>자소서 통계</div>
        ),
      },
    ],
  },
];

const AdminPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedMenu, setSelectedMenu] = useState<string>("userList");
  const navigate = useNavigate();
  const renderContent = () => {
    switch (selectedMenu) {
      case "userList":
        return (
          <Suspense fallback={<div>로딩중입니다...</div>}>
            <AdminUserList />
          </Suspense>
        );
      case "userStatistic":
        return (
          <Suspense fallback={<div>로딩중입니다...</div>}>
            <AdminUserStat />
          </Suspense>
        );
      case "resumeList":
        return (
          <Suspense fallback={<div>로딩중입니다...</div>}>
            <AdminResumeList />
          </Suspense>
        );
      case "resumeStatistic":
        return (
          <Suspense fallback={<div>로딩중입니다...</div>}>
            <AdminResumeStat />
          </Suspense>
        );
      default:
        return <div>선택된 메뉴가 없습니다!</div>;
    }
  };
  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            color: "white",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>관리자 페이지</div>

          <div>
            <Button
              onClick={() => {
                let refreshToken = localStorage.getItem("refresh");
                let res = axiosInstance
                  .post(
                    "/logout",
                    {},
                    {
                      headers: {
                        refresh: refreshToken,
                      },
                    }
                  )
                  .then((res) => {
                    if (res.status == 200) {
                      localStorage.removeItem("access");
                      navigate("/");
                    }
                  });
              }}
              style={{
                fontWeight: "bold",
                color: "white",
                backgroundColor: "transparent",
                border: "1px solid white",
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            onClick={({ key }) => {
              setSelectedMenu(key);
            }}
            mode="inline"
            defaultSelectedKeys={["userList"]}
            style={{ height: "100%", borderRight: 0 }}
            items={item3}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
