import Sidebar from '@/components/Sidebar';
import '@/styles/globals.css'
// import 'antd/dist/antd.css'


import { Layout, Menu, theme } from 'antd';
import React from 'react';
const { Header, Content, Footer, Sider } = Layout;

function App({ Component, pageProps }) {
  return  <Layout hasSider>
  <Sidebar/>
  <Layout
    className="site-layout"
    style={{
      marginLeft: 200,
    }}
  >
    <Header
      style={{
        padding: 0,
        // background: colorBgContainer,
      }}
    />
    <Content
      style={{
        margin: '24px 16px 0',
        overflow: 'initial',
      }}
    >
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          // background: colorBgContainer,
        }}
      >
        <Component {...pageProps}/>
      
      </div>
    </Content>
    <Footer
      style={{
        textAlign: 'center',
      }}
    >
     Created by @iamananya
    </Footer>
  </Layout>
</Layout>
}


export default App;