import { Form, Input, Button, message } from 'antd';

const RegisterForm = () => {
  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      // Display success message
      message.success('User registered successfully');
    } catch (error) {
      console.error(error);
      message.error('Failed to register. Please try again.');
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
          {
            min: 6,
            message: 'Password must be at least 6 characters',
          },
        ]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: 'Please enter your name',
          },
        ]}
      >
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;