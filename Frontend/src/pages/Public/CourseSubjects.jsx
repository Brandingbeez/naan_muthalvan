import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourse, getSubjects } from '../../api/public'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'
import { Row, Col, Card, Button, Typography, Breadcrumb, Tag, Grid, Empty } from 'antd'
import { RightOutlined, FileTextOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { useBreakpoint } = Grid

const CourseSubjects = () => {
  const screens = useBreakpoint()
  const { courseCode } = useParams()
  const [course, setCourse] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      getCourse(courseCode),
      getSubjects(courseCode)
    ])
      .then(([courseRes, subjectsRes]) => {
        setCourse(courseRes.data)
        setSubjects(subjectsRes.data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [courseCode])

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
          { title: <Link to="/">Courses</Link> },
          { title: 'Subjects' }
        ]}
      />

      <div style={{ marginBottom: screens.xs ? '24px' : screens.sm ? '32px' : '40px', padding: screens.xs ? '0 8px' : '0' }}>
        <Title level={1} style={{ fontSize: getTitleFontSize(), margin: '0 0 12px 0' }}>
          {course ? `${course.title} Subjects` : 'Course Subjects'}
        </Title>
        {course && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: screens.xs ? '8px' : '12px',
            marginBottom: '12px',
            fontSize: screens.xs ? '12px' : '14px'
          }}>
            <span style={{ fontWeight: 600 }}>Course Code:</span>
            <span>{course.courseCode}</span>
            <Tag color={course.courseType === 'online' ? 'green' : 'orange'}>
              {course.courseType === 'online' ? 'Online' : 'Offline'}
            </Tag>
            {course.language && <Tag color="purple">{course.language}</Tag>}
          </div>
        )}
        <Paragraph style={{ fontSize: getSubtitleFontSize(), margin: 0 }}>
          Explore the subjects and topics covered in this course
        </Paragraph>
      </div>

      {subjects.length === 0 ? (
        <Empty description="No subjects available for this course." />
      ) : (
        <Row gutter={[screens.xs ? 12 : screens.sm ? 16 : 24, screens.xs ? 12 : screens.sm ? 16 : 24]}>
          {subjects.map(subject => (
            <Col key={subject._id} xs={24} sm={12} md={8} lg={6}>
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: getCoverHeight(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FileTextOutlined style={{ fontSize: getIconSize() }} />
                  </div>
                }
              >
                <Card.Meta
                  title={<Text strong style={{ fontSize: screens.xs ? '14px' : '16px' }}>{subject.title}</Text>}
                  description={
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ fontSize: screens.xs ? '12px' : '14px', margin: '8px 0 0 0' }}
                    >
                      {subject.content || 'Learn comprehensive subject matter'}
                    </Paragraph>
                  }
                />
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to={`/subjects/${subject._id}`}>
                    <Button
                      type="primary"
                      icon={<RightOutlined />}
                      size={screens.xs ? 'small' : 'middle'}
                    >
                      View Details
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

export default CourseSubjects