import axiosInstance from "@/api/api";
import { Avatar, Button, Divider, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/globalTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Resume {
  content: string;
  r_num: number;
  rating: number;
  rating_count: number;
  read_num: number;
  title: string;
  username: string;
  u_num: number;
  w_date: string;
}

interface Comment {
  c_content: string;
  c_num: number;
  num: number;
  r_num: number;
  u_num: number;
  username: string;
  w_date: string;
}

const ResumeListDetails = () => {
  const [resume, setResume] = useState<Partial<Resume>>({});
  const [comment, setComment] = useState<Comment[]>([]); // Comment 타입의 배열로 초기화
  const [editId, setEditId] = useState<number | null>(null);
  const [writeComment, setWriteComment] = useState<string>("");
  const [editComment, setEditComment] = useState<string>("");
  const accessToken = localStorage.getItem("access") ?? "";
  const DecodedToken: DecodedToken = jwtDecode(accessToken);
  const userInfo = DecodedToken.username;
  const param = useParams();
  const fetchComment = (page: number) => {
    let res = axiosInstance
      .get(`/comments/${param.id}`, {
        params: {
          page: 0,
        },
      })
      .then((res) => {
        setComment(res.data.response);
      });
  };
  const fetchResume = () => {
    let res = axiosInstance.get(`/board/list/${param.id}`).then((res) => {
      setResume(res.data);
    });
  };

  const deleteComment = (c_num: number) => {
    Modal.confirm({
      title: "댓글 삭제하기",
      content: (
        <div>
          <p>정말 해당 댓글을 삭제하시겠습니까?</p>
        </div>
      ),
      okText: "삭제",
      cancelText: "취소",
      centered: true,

      onOk() {
        let res = axiosInstance
          .put(`/comments/delete/${c_num}`, {
            c_num: c_num,
          })
          .then((res) => {
            fetchComment(0);
          })
          .catch((err) => {
            console.log(err);
          });
      },
    });
  };
  useEffect(() => {
    let res = Promise.all([fetchResume(), fetchComment(0)]);
  }, []);
  return (
    <div
      className="Wrapper"
      style={{ padding: "5% 7%", display: "flex", alignItems: "flex-start" }}
    >
      <div
        className="DetailContentWrapper"
        style={{
          width: "50vw",
          border: "1px solid rgb(220,220,220)",
          padding: "5%",
        }}
      >
        <div className="DetailContentHeader">
          <h1>{resume.title}</h1>
        </div>
        <div className="DetailContentDate">
          <h3>작성일자: {resume.w_date}</h3>
        </div>
        <div className="DetailContentMain">{resume.content}</div>
      </div>
      <div
        style={{
          marginLeft: "1%",
          border: "1px solid rgb(220,220,220)",
          width: "30vw",
          height: "auto",
          padding: "2% 3%",
        }}
      >
        <div className="commentHeader" style={{ fontSize: "1.1rem" }}>
          <div>
            <b>작성자: </b>
            {resume.username}
          </div>
          <div>
            <b>총 댓글수:</b> {comment.length}
          </div>
          <div>
            <b>총 조회수:</b> {resume.read_num}
          </div>
          <div>
            <b>작성일:</b> {resume.w_date}
          </div>
          <div>
            <b>평점:</b> {resume.rating} / 5
          </div>
        </div>
        <Divider />
        <div className="commentListWrapper">
          {comment.map((comment, idx) => {
            return (
              <div
                key={`comment${idx}`}
                style={{
                  width: "95%",
                  border: "1px solid rgb(220,220,220)",
                  padding: "2% 3%",
                }}
              >
                <div style={{ marginBottom: "2%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <Avatar size={23} icon={<UserOutlined />} />{" "}
                      {comment.username}
                    </div>
                    {userInfo == comment.username && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "15%",
                          fontSize: "0.8rem",
                          color: "rgb(200,200,200)",
                        }}
                      >
                        <div
                          onClick={() => setEditId(comment.c_num)}
                          style={{ cursor: "pointer" }}
                        >
                          수정
                        </div>
                        <div>|</div>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => deleteComment(comment.c_num)}
                        >
                          삭제
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    style={{ fontSize: "0.8rem", color: "rgb(150,150,150)" }}
                  >
                    {comment.w_date.slice(0, 10)}
                  </div>
                </div>
                {editId == comment.c_num ? (
                  <div>
                    <div>
                      <TextArea
                        onChange={(e) => {
                          setEditComment(e.target.value);
                        }}
                        rows={3}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "1%",
                      }}
                    >
                      <Button
                        onClick={() => {
                          setEditId(null);
                        }}
                        style={{ fontWeight: "bold", marginRight: "1%" }}
                      >
                        취소
                      </Button>
                      <Button
                        onClick={() => {
                          let res = axiosInstance
                            .put(`/comments/update/${comment.c_num}`, {
                              c_num: comment.c_num,
                              c_content: editComment,
                            })
                            .then((res) => {
                              fetchComment(0);
                              setEditId(null);
                            });
                        }}
                        style={{
                          backgroundColor: "#82D6CE",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        수정
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>{comment.c_content}</div>
                )}
              </div>
            );
          })}
        </div>
        <div className="writeCommentWrapper" style={{ width: "100%" }}>
          <div style={{ marginTop: "3%", marginBottom: "2%", width: "100%" }}>
            <TextArea
              onChange={(e) => {
                setWriteComment(e.target.value);
              }}
              rows={3}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                let accessToken = localStorage.getItem("access") ?? "";
                let DecodedToken: any = jwtDecode(accessToken);
                let u_num = DecodedToken.uNum;
                let res = axiosInstance
                  .post(`/comments/write`, {
                    ccontent: writeComment,
                    rnum: resume.r_num,
                    unum: u_num,
                  })
                  .then((res) => {
                    fetchComment(0);
                  });
              }}
              style={{
                backgroundColor: "#82D6CE",
                color: "white",
                fontWeight: "bold",
              }}
            >
              댓글 작성
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeListDetails;
