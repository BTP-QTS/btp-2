import { Button, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;

const FileUpload = () => {
  const onFinish = async (values) => {
    console.log(values);
    try {
      const formData = new FormData();
      formData.append('uploadedFile', values.uploadedFile[0].originFileObj);
      const response = await axios.post('http://localhost:3000/file', formData, { withCredentials: true },{
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response);
      // message.success(response.data);
    } catch (error) {
      console.log(error)
      // message.error(error.response.data);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="uploadedFile" label="File" valuePropName="fileList" getValueFromEvent={normFile}>
        <Dragger accept=".pdf,.doc,.docx" maxCount={1}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single upload.</p>
        </Dragger>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FileUpload;
