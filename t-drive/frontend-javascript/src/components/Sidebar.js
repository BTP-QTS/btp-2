// import '@/styles/globals.css'
// import 'antd/dist/antd.css'


import { Layout, Menu, theme ,message} from 'antd';
import React from 'react';
const { Header, Content, Footer, Sider } = Layout;

import {
 
  CloudOutlined,
 
  TeamOutlined,
  UploadOutlined,
  UserOutlined,

} from '@ant-design/icons';

import { useRouter } from 'next/router';

function Sidebar() {



  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'GET',
      });

      // Clear user data from cookie
      document.cookie = 'user=;max-age=0';

      // Display success message
      message.success('Logged out successfully');
    } catch (error) {
      console.error(error);
      message.error('Failed to logout. Please try again.');
    }
  };
    const router=useRouter();
  return (
    <div><Sider
    style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
    }}
  >
    <div
      style={{
        height: 32,
        margin: 16,
        background: 'rgba(255, 255, 255, 0.2)',
      }}
    />
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        <Menu.Item key='1' icon={<UserOutlined/>} onClick={()=>{
            router.push('/register')
        }}>
            Register
        </Menu.Item>
        <Menu.Item key='2' icon={<UserOutlined/>} onClick={()=>{
            router.push('/login')
        }}>
            Login
        </Menu.Item>
        <Menu.Item key='4' icon={<UserOutlined/>} onClick={()=>{
            router.push('/upload')
        }}>
            Upload Files
        </Menu.Item>
        <Menu.Item key='5' icon={<UserOutlined/>} onClick={()=>{
            router.push('/myFiles')
        }}>
            My Files
        </Menu.Item>
        <Menu.Item key='6' icon={<UserOutlined/>} onClick={()=>{
            router.push('/sharedWithMe')
        }}>
            Shared with Me
        </Menu.Item>
        <Menu.Item key='7' icon={<UserOutlined/>} onClick={handleLogout}>
           LogOut
        </Menu.Item>
    </Menu>
  </Sider></div>
  )
}

export default Sidebar