import { Layout, Button, Menu, Drawer, Grid } from 'antd'
import { Link } from 'react-router-dom'
import { HomeOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Header, Content, Footer } = Layout
const { useBreakpoint } = Grid

const PublicLayout = ({ children }) => {
  const screens = useBreakpoint()
  const [drawerVisible, setDrawerVisible] = useState(false)

  const menuItems = [
    {
      key: '/',
      label: 'Home',
      icon: <HomeOutlined />,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        style={{
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: screens.xs ? '0 16px' : '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: screens.xs ? '56px' : '64px',
          zIndex: 100,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            fontSize: screens.xs ? '18px' : '20px',
            fontWeight: '700',
            color: '#1890ff',
            whiteSpace: 'nowrap',
          }}>
            BB LMS
          </div>
        </Link>

        {screens.md ? (
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['/']}
            items={menuItems}
            style={{
              border: 'none',
              flex: 1,
              marginLeft: '48px',
              backgroundColor: 'transparent',
            }}
          />
        ) : (
          <Button
            type="text"
            icon={drawerVisible ? <CloseOutlined /> : <MenuOutlined />}
            onClick={() => setDrawerVisible(!drawerVisible)}
            style={{ fontSize: '18px' }}
          />
        )}
      </Header>

      <Drawer
        title="Menu"
        placement="right"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Menu
          mode="vertical"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={() => setDrawerVisible(false)}
        />
      </Drawer>

      <Content style={{
        padding: screens.xs ? '16px' : screens.sm ? '24px' : '32px 48px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        flex: 1,
      }}>
        {children}
      </Content>

      <Footer style={{
        textAlign: 'center',
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        padding: screens.xs ? '16px' : '24px',
        marginTop: 'auto',
        fontSize: screens.xs ? '12px' : '14px',
      }}>
        BB LMS ©2025 - Learning Management System
      </Footer>
    </Layout>
  )
}

export default PublicLayout