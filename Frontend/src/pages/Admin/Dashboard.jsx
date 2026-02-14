import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Button, Space, Typography, Grid, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import {
  EnvironmentOutlined,
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FileOutlined,
  CloudUploadOutlined,
  AuditOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { getCenters, getCourses, getSubjects, getSessions, getResources } from '../../api/admin'

const { Title, Paragraph } = Typography
const { useBreakpoint } = Grid

const Dashboard = () => {
  const [stats, setStats] = useState({
    centers: 0,
    courses: 0,
    subjects: 0,
    sessions: 0,
    resources: 0,
  })
  const [loading, setLoading] = useState(true)
  const screens = useBreakpoint()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [centersRes, coursesRes, subjectsRes, sessionsRes, resourcesRes] = await Promise.all([
        getCenters(),
        getCourses(),
        getSubjects(),
        getSessions(),
        getResources(),
      ])

      setStats({
        centers: centersRes.data.length,
        courses: coursesRes.data.length,
        subjects: subjectsRes.data.length,
        sessions: sessionsRes.data.length,
        resources: resourcesRes.data.length,
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      title: 'Centers',
      icon: <EnvironmentOutlined style={{ fontSize: '28px', color: '#1890ff' }} />,
      count: stats.centers,
      link: '/admin/centers',
      color: '#1890ff',
      bgColor: '#e6f7ff',
    },
    {
      title: 'Courses',
      icon: <BookOutlined style={{ fontSize: '28px', color: '#52c41a' }} />,
      count: stats.courses,
      link: '/admin/courses',
      color: '#52c41a',
      bgColor: '#f6ffed',
    },
    {
      title: 'Subjects',
      icon: <FileTextOutlined style={{ fontSize: '28px', color: '#faad14' }} />,
      count: stats.subjects,
      link: '/admin/subjects',
      color: '#faad14',
      bgColor: '#fffbe6',
    },
    {
      title: 'Sessions',
      icon: <CalendarOutlined style={{ fontSize: '28px', color: '#f5222d' }} />,
      count: stats.sessions,
      link: '/admin/sessions',
      color: '#f5222d',
      bgColor: '#fff1f0',
    },
    {
      title: 'Resources',
      icon: <FileOutlined style={{ fontSize: '28px', color: '#13c2c2' }} />,
      count: stats.resources,
      link: '/admin/resources',
      color: '#13c2c2',
      bgColor: '#e6fffb',
    },
  ]

  const menuItems = [
    { title: 'Centers', icon: <EnvironmentOutlined />, link: '/admin/centers' },
    { title: 'Courses', icon: <BookOutlined />, link: '/admin/courses' },
    { title: 'Subjects', icon: <FileTextOutlined />, link: '/admin/subjects' },
    { title: 'Sessions', icon: <CalendarOutlined />, link: '/admin/sessions' },
    { title: 'Resources', icon: <FileOutlined />, link: '/admin/resources' },
    { title: 'NM Publish', icon: <CloudUploadOutlined />, link: '/admin/nm' },
    { title: 'Audit Logs', icon: <AuditOutlined />, link: '/admin/audit' },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: '32px' }}>
        <Title level={1} style={{ marginBottom: '8px', fontSize: screens.xs ? '24px' : '32px' }}>
          Dashboard
        </Title>
        <Paragraph type="secondary">
          Welcome back! Here's an overview of your LMS content.
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
        {cards.map(card => (
          <Col key={card.title} xs={24} sm={12} lg={8}>
            <Link to={card.link} style={{ textDecoration: 'none' }}>
              <Card
                hoverable
                style={{
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0',
                  height: '100%',
                  background: card.bgColor,
                  transition: 'all 0.3s ease',
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: card.color }}>
                      {card.title}
                    </Title>
                    {card.icon}
                  </div>
                  {loading ? (
                    <Skeleton active paragraph={false} />
                  ) : (
                    <Statistic
                      value={card.count}
                      valueStyle={{ color: card.color, fontSize: '28px', fontWeight: 'bold' }}
                    />
                  )}
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    Total {card.title.toLowerCase()}
                  </Typography.Text>
                </Space>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Quick Access */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={3}>Quick Access</Title>
        <Row gutter={[12, 12]}>
          {menuItems.map(item => (
            <Col key={item.title} xs={12} sm={8} md={6} lg={4}>
              <Link to={item.link} style={{ textDecoration: 'none' }}>
                <Button
                  type="default"
                  block
                  icon={item.icon}
                  style={{
                    height: '40px',
                    borderRadius: '6px',
                  }}
                >
                  {item.title}
                </Button>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>

      {/* System Information */}
      <Card>
        <Title level={3}>System Information</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Paragraph>
              <strong>Total Content Items:</strong> {stats.centers + stats.courses + stats.subjects + stats.sessions + stats.resources}
            </Paragraph>
          </Col>
          <Col xs={24} sm={12}>
            <Paragraph>
              <strong>Last Updated:</strong> {new Date().toLocaleString()}
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </AdminLayout>
  )
}

export default Dashboard