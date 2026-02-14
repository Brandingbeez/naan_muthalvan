import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourses } from '../../api/public'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'
import { Row, Col, Card, Button, Typography, Breadcrumb, Tag, Grid, Empty } from 'antd'
import { RightOutlined, BookOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { useBreakpoint } = Grid

const CenterCourses = () => {
  const screens = useBreakpoint()
  const { centerId } = useParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getCourses(centerId)
      .then(res => setCourses(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [centerId])

  const getTitleFontSize = () => screens.xs ? '24px' : screens.sm ? '28px' : '32px'
  const getSubtitleFontSize = () => screens.xs ? '14px' : '16px'
  const getCoverHeight = () => screens.xs ? 120 : screens.sm ? 140 : 160
  const getIconSize = () => screens.xs ? '40px' : screens.sm ? '48px' : '56px'

  if (loading) return <Layout><Loading /></Layout>
  if (error) return <Layout><ErrorState error={error} retry={() => window.location.reload()} /></Layout>

  return (
    <Layout>
      <Breadcrumb
        style={{ marginBottom: screens.xs ? '16px' : screens.sm ? '20px' : '24px' }}
        items={[
          { title: <Link to="/">Home</Link> },
          { title: 'Courses' }
        ]}
      />

      <div style={{ marginBottom: screens.xs ? '24px' : screens.sm ? '32px' : '40px', padding: screens.xs ? '0 8px' : '0' }}>
        <Title level={1} style={{ fontSize: getTitleFontSize(), margin: '0 0 12px 0' }}>
          Courses Catalog
        </Title>
        <Paragraph style={{ fontSize: getSubtitleFontSize() }}>
          Browse and enroll in our comprehensive course offerings
        </Paragraph>
      </div>

      {courses.length === 0 ? (
        <Empty description="No courses available at this time." />
      ) : (
        <Row gutter={[screens.xs ? 12 : screens.sm ? 16 : 24, screens.xs ? 12 : screens.sm ? 16 : 24]}>
          {courses.map(course => (
            <Col key={course._id} xs={24} sm={12} md={8} lg={6}>
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
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    height: getCoverHeight(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <BookOutlined style={{ fontSize: getIconSize() }} />
                  </div>
                }
              >
                <Card.Meta
                  title={<Text strong style={{ fontSize: screens.xs ? '14px' : '16px' }}>{course.title}</Text>}
                  description={
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {course.courseCode && <Tag color="blue">{course.courseCode}</Tag>}
                        {course.courseType && (
                          <Tag color={course.courseType === 'online' ? 'green' : 'orange'}>
                            {course.courseType.toUpperCase()}
                          </Tag>
                        )}
                      </div>
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ fontSize: screens.xs ? '12px' : '14px', margin: 0 }}
                      >
                        {course.description || 'Comprehensive course material and resources'}
                      </Paragraph>
                    </div>
                  }
                />
                <div style={{ marginTop: '16px' }}>
                  {course.objectives && course.objectives.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <Text type="secondary" style={{ fontSize: screens.xs ? '11px' : '12px' }}>
                        {course.objectives.length} learning objectives
                      </Text>
                    </div>
                  )}
                  <Link to={`/courses/${course.courseCode}`}>
                    <Button type="primary" block icon={<RightOutlined />} size={screens.xs ? 'small' : 'middle'}>
                      View Subjects
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

export default CenterCourses