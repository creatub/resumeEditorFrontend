import { Button, Form } from "antd";
import axios from "axios";

import { Cookies } from "react-cookie";
const ResumeList = () => {
  const cookies = new Cookies();
  return (
    <div>
      <Button
        onClick={async () => {
          let token = localStorage.getItem("access");
          // "https://port-0-resumeeditorbackend-1cupyg2klvkj0ixw.sel5.cloudtype.app/board/list",
          let response = await axios
            .get(
              "https://port-0-resumeeditorbackend-1cupyg2klvkj0ixw.sel5.cloudtype.app/board/list",
              {
                headers: {
                  Authorization: `${token}`,
                },
                withCredentials: true,
              }
            )
            .then((data) => console.log(data));
        }}
      >
        TEST
      </Button>
    </div>
  );
};

export default ResumeList;
