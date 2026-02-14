import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSessions } from '../../api/public'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'
import { Row, Col, Card, Button, Typography, Breadcrumb, Badge, Tag, Grid, Empty } from 'antd'
import { RightOutlined, PlayCircleOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { useBreakpoint } = Grid

const SubjectDetail = () => {
  const screens = useBreakpoint()
  const { subjectId } = useParams()
  const [sessions, setSessions] = useState([])
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSessions(subjectId)
      .then(res => {
        setSessions(res.data)
        if (res.data.length > 0) {
          setSubject(res.data[0].subject || {})
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [subjectId])

  const getTitleFontSize = () => screens.xs ? '24px' : screens.sm ? '28px' : '32px'
  const getSubtitleFontSize = () => screens.xs ? '14px' : '16px'
  const getCoverHeight = () => screens.xs ? 120 : screens.sm ? 140 : 160
  const getIconSize = () => screens.xs ? '40px' : screens.sm ? '48px' : '56px'

  if (loading) return <Layout><Loading /></Layout>
  if (error) return <Layout><ErrorState error={error} retry={() => window.location.reload()} /></Layout>

  return (
    <Layout>
      <div style={{ marginBottom: screens.xs ? '16px' : screens.sm ? '20px' : '24px', padding: screens.xs ? '0 8px' : '0' }}>
        <div style={{
          fontSize: screens.xs ? '12px' : '14px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: screens.xs ? '6px' : '8px'
        }}>
          <Link to="/" style={{ color: '#1890ff' }}>Home</Link>
          <span>/</span>
          <span>Subject</span>
        </div>
      </div>

      <Card
        style={{
          marginBottom: screens.xs ? '24px' : screens.sm ? '32px' : '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          border: 'none',
          color: 'white'
        }}
      >
        <div>
          <Title level={3} style={{
            color: 'white',
            margin: '0 0 12px 0',
            fontSize: screens.xs ? '20px' : screens.sm ? '24px' : '28px'
          }}>
            Subject Overview
          </Title>
          <Paragraph style={{
            color: 'rgba(255, 255, 255, 0.85)',
            margin: 0,
            fontSize: screens.xs ? '12px' : '14px'
          }}>
            Learn comprehensive material and access all available sessions for this subject
          </Paragraph>
        </div>
      </Card>

      <div style={{ marginBottom: screens.xs ? '20px' : screens.sm ? '28px' : '32px', padding: screens.xs ? '0 8px' : '0' }}>
        <Title level={2} style={{
          margin: '0 0 8px 0',
          fontSize: screens.xs ? '18px' : screens.sm ? '22px' : '26px'
        }}>
          Learning Sessions
        </Title>
        <Paragraph style={{
          fontSize: screens.xs ? '13px' : '14px',
          color: '#666',
          margin: 0
        }}>
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} available
        </Paragraph>
      </div>

      {sessions.length === 0 ? (
        <Empty description="No sessions available for this subject." />
      ) : (
        <Row gutter={[screens.xs ? 12 : screens.sm ? 16 : 24, screens.xs ? 12 : screens.sm ? 16 : 24]}>
          {sessions.map((session, index) => (
            <Col key={session._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  height: '100%',
                  overflow: 'hidden'
                }}
                cover={
                  <div style={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    height: getCoverHeight(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative'
                  }}>
                    <PlayCircleOutlined style={{ fontSize: getIconSize() }} />
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      zIndex: 2
                    }}>
                      <Badge
                        count={index + 1}
                        style={{
                          backgroundColor: '#1890ff',
                          fontSize: screens.xs ? '10px' : '12px'
                        }}
                      />
                    </div>
                  </div>
                }
              >
                <Card.Meta
                  title={<Text strong style={{ fontSize: screens.xs ? '14px' : '16px' }}>{session.title}</Text>}
                  description={
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ fontSize: screens.xs ? '12px' : '14px', margin: '8px 0 0 0' }}
                    >
                      {session.description || 'Interactive learning session'}
                    </Paragraph>
                  }
                />
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to={`/sessions/${session._id}`}>
                    <Button
                      type="primary"
                      icon={<RightOutlined />}
                      size={screens.xs ? 'small' : 'middle'}
                    >
                      Access
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Layout>
  )
}

export default SubjectDetail