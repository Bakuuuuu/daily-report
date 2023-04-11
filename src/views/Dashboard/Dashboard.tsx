import React, { useState } from 'react'
import { Breadcrumb, Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import SliderMenu from '@/components/Menu'
import { ReactSVG } from 'react-svg'
import reportSvg from '@/icons/report.svg'

const { Header, Content, Footer, Sider } = Layout
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">
          {collapsed ? (
            <ReactSVG className="wrapper" src={reportSvg}></ReactSVG>
          ) : (
            '日报管理'
          )}
        </div>
        <SliderMenu></SliderMenu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Breadcrumb style={{ margin: '0 16px', lineHeight: '64px' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content
          className="site-layout-background"
          style={{ margin: '16px 16px 0' }}
        >
          <Outlet></Outlet>
        </Content>
        <Footer style={{ textAlign: 'center', padding: 0, lineHeight: '48px' }}>
          Admin ©2023 Created by XXXXX
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App
