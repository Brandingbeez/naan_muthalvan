import { useEffect, useState } from 'react'
import { Card, Button, List, Space, Typography, Spin, Alert, Tag, Row, Col, Grid } from 'antd'
import { CloudUploadOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import AdminLayout from '../../components/AdminLayout'
import { getNmCourses, publishCourse } from '../../api/admin'
import { showToast } from '../../components/Toast'

const { Title, Paragraph, Text } = Typography
const { useBreakpoint } = Grid

const NmPublish = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState({})
  const screens = useBreakpoint()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const res = await getNmCourses()
      setCourses(res.data)
    } catch (err) {
      showToast('Error loading courses', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (courseCode) => {
    setPublishing(prev => ({ ...prev, [courseCode]: true }))
    try {
      await publishCourse(courseCode)
      showToast('Course published successfully', 'success')
      loadCourses()
    } catch (err) {
      showToast(err.response?.data?.message || 'Error publishing course', 'error')
    } finally {
      setPublishing(prev => ({ ...prev, [courseCode]: false }))
    }
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ fontSize: screens.xs ? '20px' : '28px', margin: 0 }}>NM Partner Integration</Title>
        <Paragraph type="secondary" style={{ marginTop: '8px' }}>
          Publish courses to National Market (NM) platform for partner distribution
        </Paragraph>
      </div>

      <Alert
        message="NM Publish Information"
        description="Select courses below to publish them to the National Market platform. Publishing makes courses available to NM partners."
        type="info"
        showIcon
        icon={<CloudUploadOutlined />}
        style={{ marginBottom: '24px' }}
      />

      <Card loading={loading}>
        {courses.length === 0 ? (
          <Card>
            <Paragraph type="secondary">No courses available to publish.</Paragraph>
          </Card>
        ) : (
          <List
            dataSource={courses}
            renderItem={(course) => (
              <List.Item
                key={course._id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f0f0f0',
                  flexDirection: screens.xs ? 'column' : 'row',
                }}
                actions={[
                  <Button
                    type="primary"
                    icon={
                      publishing[course.courseCode] ? (
                        <LoadingOutlined />
                      ) : (
                        <CloudUploadOutlined />
                      )
                    }
                    onClick={() => handlePublish(course.courseCode)}
                    loading={publishing[course.courseCode]}
                    disabled={publishing[course.courseCode]}
                    block={screens.xs}
                    size={screens.xs ? 'middle' : 'middle'}
                  >
                    {publishing[course.courseCode] ? 'Publishing...' : 'Publish'}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    course.isPublished ? (
                      <CheckCircleOutlined style={{ fontSize: '28px', color: '#52c41a' }} />
                    ) : (
                      <CloudUploadOutlined style={{ fontSize: '28px', color: '#1890ff' }} />
                    )
                  }
                  title={
                    <Space wrap>
                      <Text strong style={{ fontSize: screens.xs ? '14px' : '16px' }}>{course.title}</Text>
                      {course.isPublished && <Tag color="success">Published</Tag>}
                      <Tag color="blue">{course.courseCode}</Tag>
                    </Space>
                  }
                  description={
                    <Paragraph ellipsis={{ rows: screens.xs ? 2 : 2 }} style={{ marginTop: '8px' }}>
                      {course.description || 'No description provided'}
                    </Paragraph>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <Title level={4} style={{ fontSize: screens.xs ? '16px' : '18px' }}>Publishing Guidelines</Title>
        <ul style={{ fontSize: screens.xs ? '13px' : '14px' }}>
          <li>Ensure all course materials are complete before publishing</li>
          <li>Verify course metadata and descriptions</li>
          <li>Check that all resources are properly linked</li>
          <li>Published courses will be visible to all NM partners</li>
          <li>Updates to courses may take up to 24 hours to reflect on partner platforms</li>
        </ul>
      </Card>
    </AdminLayout>
  )
}

export default NmPublish