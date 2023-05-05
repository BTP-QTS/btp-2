import { Form, Input, Button, message } from 'antd';

const LoginForm = () => {
  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const result = await response.text();
        console.log(result);

        // Set user data in cookie
        document.cookie = `user=${result};max-age=3600`;

        // Display success message
        message.success('Logged in successfully');
      } else {
        const error = await response.text();
        message.error('Email and password did not match successsfully');
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to login. Please try again.');
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your email address',
          },
          {
            type: 'email',
            message: 'Please enter a valid email address',
          },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please enter your password',
          },
        ]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
