import { useState } from 'react'
import { Layout, Menu, Button, Dropdown, Space, Avatar, Drawer, Grid } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../auth/AdminAuthContext'
import {
  DashboardOutlined,
  EnvironmentOutlined,
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FileOutlined,
  CloudUploadOutlined,
  AuditOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content, Footer } = Layout
const { useBreakpoint } = Grid

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const { logout, admin } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const screens = useBreakpoint()

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => {
        navigate('/admin')
        setDrawerVisible(false)
      },
    },
    {
      key: '/admin/centers',
      icon: <EnvironmentOutlined />,
      label: 'Centers',
      onClick: () => {
        navigate('/admin/centers')
        setDrawerVisible(false)
      },
    },
    {
      key: '/admin/courses',
      icon: <BookOutlined />,
      label: 'Courses',
      onClick: () => {
        navigate('/admin/courses')
        setDrawerVisible(false)
      },
    },
    {
      key: '/admin/subjects',
      icon: <FileTextOutlined />,
      label: 'Subjects',
      onClick: () => {
        navigate('/admin/subjects')
        setDrawerVisible(false)
      },
    },
    {
      key: '/admin/sessions',
      icon: <CalendarOutlined />,
      label: 'Sessions',
      onClick: () => {
        navigate('/admin/sessions')
        setDrawerVisible(false)
      },
    },
    {
      key: '/admin/resources',
      icon: <FileOutlined />,
      label: 'Resources',
      onClick: () => {
        navigate('/admin/resources')
        setDrawerVisible(false)
      },
    },
    {
      key: '/admin/nm',
      icon: <CloudUploadOutlined />,
      label: 'NM Publish',
      onClick: () => {
        navigate('/admin/nm')
        setDrawerVisible(false)
      },
    },
    {
      key: '/admin/audit',
      icon: <AuditOutlined />,
      label: 'Audit Logs',
      onClick: () => {
        navigate('/admin/audit')
        setDrawerVisible(false)
      },
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const userMenu = [
    {
      key: 'profile',
      disabled: true,
      label: `Profile: ${admin?.email}`,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {screens.md ? (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          collapsedWidth={0}
          style={{
            background: '#001529',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 99,
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '20px',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!collapsed && 'BB LMS'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            selectedKeys={[location.pathname]}
            items={menuItems}
          />
        </Sider>
      ) : (
        <Drawer
          title="BB LMS"
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <Menu
            theme="light"
            mode="vertical"
            defaultSelectedKeys={[location.pathname]}
            selectedKeys={[location.pathname]}
            items={menuItems}
          />
        </Drawer>
      )}

      <Layout style={{ marginLeft: screens.md ? (collapsed ? 0 : 250) : 0, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            background: '#fff',
            padding: screens.xs ? '0 16px' : '0 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: screens.xs ? '56px' : '64px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          {screens.md ? (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px' }}
            />
          ) : (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              style={{ fontSize: '16px' }}
            />
          )}

          <Dropdown menu={{ items: userMenu }}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar>{admin?.email?.charAt(0).toUpperCase()}</Avatar>
              {!screens.xs && <span style={{ fontSize: '14px' }}>{admin?.email}</span>}
            </Space>
          </Dropdown>
        </Header>

        <Content style={{
          padding: screens.xs ? '16px' : screens.sm ? '20px' : '24px',
          background: '#f5f7fa',
          minHeight: 'calc(100vh - 120px)',
        }}>
          <div style={{
            background: '#fff',
            padding: screens.xs ? '16px' : screens.sm ? '20px' : '24px',
            borderRadius: '6px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            minHeight: 'calc(100vh - 180px)',
          }}>
            {children}
          </div>
        </Content>

        <Footer style={{
          textAlign: 'center',
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          padding: screens.xs ? '12px' : '16px',
          fontSize: screens.xs ? '12px' : '13px',
          marginTop: '16px',
        }}>
          BB LMS Admin Dashboard ©2025
        </Footer>
      </Layout>
    </Layout>
  )
}

export default AdminLayout