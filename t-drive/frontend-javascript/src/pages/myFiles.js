import { useState, useEffect } from "react";
import { Table } from "antd";
import axios from 'axios';

export default function FileTable() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:3000/file",{ withCredentials: true });
      // const data = await res.json();
      const data = await res.data;
      console.log(data);

      const formattedData = data.map((file) => ({
        key: file.Key,
        fileName: file.Record.Name,
        downloadLink: file.Record.DownloadLink,
        uploaderEmail: file.Record.UploaderEmail,
        fileHash: file.Record.Filehash,

      }));
      // console.log(formattedData)
      setFiles(formattedData);
    };
    fetchData();
  }, []);


  

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Download Link",
      dataIndex: "downloadLink",
      key: "downloadLink",
    },
    {
      title: "Uploader Email",
      dataIndex: "uploaderEmail",
      key: "uploaderEmail",
    },
    {
      title: "File Hash",
      dataIndex: "fileHash",
      key: "fileHash",
    },
 
  ];

  return <Table columns={columns} dataSource={files} />;
}
