import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Button, Card, Space, Typography, Row, Col, Popconfirm, Select, Grid } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import AdminLayout from '../../components/AdminLayout'
import Table from '../../components/Table'
import { getSessions, createSession, updateSession, deleteSession, getSubjects } from '../../api/admin'
import { showToast } from '../../components/Toast'

const { Title } = Typography
const { useBreakpoint } = Grid

const Sessions = () => {
  const [sessions, setSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])
  const [subjects, setSubjects] = useState([])
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
    const filtered = sessions.filter(session =>
      session.title.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredSessions(filtered)
  }, [searchText, sessions])

  const loadData = async () => {
    setLoading(true)
    try {
      const [sessionsRes, subjectsRes] = await Promise.all([
        getSessions(),
        getSubjects(),
      ])
      setSessions(sessionsRes.data)
      setSubjects(subjectsRes.data)
    } catch (err) {
      showToast('Error loading sessions', 'error')
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
      await deleteSession(id)
      showToast('Session deleted successfully', 'success')
      loadData()
    } catch (err) {
      showToast('Error deleting session', 'error')
    }
  }

  const onFinish = async (values) => {
    try {
      if (editing) {
        await updateSession(editing._id, values)
        showToast('Session updated successfully', 'success')
      } else {
        await createSession(values)
        showToast('Session created successfully', 'success')
      }
      setModalVisible(false)
      loadData()
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving session', 'error')
    }
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'sessionNumber', label: 'Session #', priority: 'secondary' },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} justify="space-between" align={screens.xs ? 'stretch' : 'middle'}>
          <Col xs={24} sm={12}>
            <Title level={2} style={{ margin: 0, fontSize: screens.xs ? '20px' : '28px' }}>Sessions</Title>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: screens.xs ? 'left' : 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} block={screens.xs}>
              Add Session
            </Button>
          </Col>
        </Row>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Search sessions..."
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
          data={filteredSessions.map(session => ({
            ...session,
            id: session._id,
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
                title="Delete Session"
                description="Are you sure you want to delete this session?"
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
        title={editing ? 'Edit Session' : 'Add New Session'}
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
            label="Subject"
            name="subjectId"
            rules={[{ required: true, message: 'Please select a subject' }]}
          >
            <Select
              placeholder="Select a subject"
              options={subjects.map(s => ({ label: s.title, value: s._id }))}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Session Title"
            name="title"
            rules={[{ required: true, message: 'Please enter session title' }]}
          >
            <Input placeholder="e.g., Introduction" size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea placeholder="Session description" rows={3} size="large" />
          </Form.Item>

          <Form.Item
            label="Session Number"
            name="sessionNumber"
            rules={[{ required: true, message: 'Please enter session number' }]}
          >
            <InputNumber placeholder="1" min={1} size="large" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {editing ? 'Update' : 'Create'} Session
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  )
}

export default Sessions