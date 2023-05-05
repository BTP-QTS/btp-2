import { useEffect, useState } from "react";
import { Table } from "antd";

function FileShareWithMe() {
  const [fileShareList, setFileShareList] = useState([]);

  useEffect(() => {
    const fetchFileShareList = async () => {
      const res = await fetch("http://localhost:3000/fileShare/withMe", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: document.cookie,
        },
      });
      const data = await res.json();
      setFileShareList(data);
    };

    fetchFileShareList();
  }, []);

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Uploader Email",
      dataIndex: "uploaderEmail",
      key: "uploaderEmail",
    },
    {
      title: "Download Link",
      dataIndex: "downloadLink",
      key: "downloadLink",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={fileShareList}
      rowKey={(record) => record.key}
    />
  );
}

export default FileShareWithMe;
