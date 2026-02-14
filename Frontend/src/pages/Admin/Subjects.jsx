import { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Card, Space, Typography, Row, Col, Popconfirm, Select, Grid } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import AdminLayout from '../../components/AdminLayout'
import Table from '../../components/Table'
import { getSubjects, createSubject, updateSubject, deleteSubject, getCourses } from '../../api/admin'
import { showToast } from '../../components/Toast'

const { Title } = Typography
const { useBreakpoint } = Grid

const Subjects = () => {
  const [subjects, setSubjects] = useState([])
  const [filteredSubjects, setFilteredSubjects] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()
  const screens = useBreakpoint()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = subjects.filter(subject =>
      subject.title.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredSubjects(filtered)
  }, [searchText, subjects])

  const loadData = async () => {
    setLoading(true)
    try {
      const [subjectsRes, coursesRes] = await Promise.all([
        getSubjects(),
        getCourses(),
      ])
      setSubjects(subjectsRes.data)
      setCourses(coursesRes.data)
    } catch (err) {
      showToast('Error loading subjects', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditing(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id)
      showToast('Subject deleted successfully', 'success')
      loadData()
    } catch (err) {
      showToast('Error deleting subject', 'error')
    }
  }

  const onFinish = async (values) => {
    try {
      if (editing) {
        await updateSubject(editing._id, values)
        showToast('Subject updated successfully', 'success')
      } else {
        await createSubject(values)
        showToast('Subject created successfully', 'success')
      }
      setModalVisible(false)
      loadData()
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving subject', 'error')
    }
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'content', label: 'Content', priority: 'secondary' },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} justify="space-between" align={screens.xs ? 'stretch' : 'middle'}>
          <Col xs={24} sm={12}>
            <Title level={2} style={{ margin: 0, fontSize: screens.xs ? '20px' : '28px' }}>Subjects</Title>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: screens.xs ? 'left' : 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} block={screens.xs}>
              Add Subject
            </Button>
          </Col>
        </Row>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Search subjects..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          size="large"
          style={{ borderRadius: '6px' }}
        />
      </Card>

      <Card loading={loading}>
        <Table
          columns={columns}
          data={filteredSubjects.map(subject => ({
            ...subject,
            id: subject._id,
          }))}
          actions={(row) => (
            <Space>
              <Button
                type="primary"
                ghost
                icon={<EditOutlined />}
                onClick={() => handleEdit(row)}
                size="small"
              >
                {!screens.xs && 'Edit'}
              </Button>
              <Popconfirm
                title="Delete Subject"
                description="Are you sure you want to delete this subject?"
                onConfirm={() => handleDelete(row.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />} size="small">
                  {!screens.xs && 'Delete'}
                </Button>
              </Popconfirm>
            </Space>
          )}
          pagination
        />
      </Card>

      <Modal
        title={editing ? 'Edit Subject' : 'Add New Subject'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={screens.xs ? '100%' : 600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Course"
            name="courseId"
            rules={[{ required: true, message: 'Please select a course' }]}
          >
            <Select
              placeholder="Select a course"
              options={courses.map(c => ({ label: c.title, value: c._id }))}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Subject Title"
            name="title"
            rules={[{ required: true, message: 'Please enter subject title' }]}
          >
            <Input placeholder="e.g., Fundamentals" size="large" />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <Input.TextArea placeholder="Subject content" rows={4} size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {editing ? 'Update' : 'Create'} Subject
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  )
}

export default Subjects