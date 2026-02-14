import { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Card, Space, Typography, Row, Col, Popconfirm, Input as AntInput, Grid } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import AdminLayout from '../../components/AdminLayout'
import Table from '../../components/Table'
import { getCenters, createCenter, updateCenter, deleteCenter } from '../../api/admin'
import { showToast } from '../../components/Toast'

const { Title, Paragraph } = Typography
const { useBreakpoint } = Grid

const Centers = () => {
  const [centers, setCenters] = useState([])
  const [filteredCenters, setFilteredCenters] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()
  const screens = useBreakpoint()

  useEffect(() => {
    loadCenters()
  }, [])

  useEffect(() => {
    const filtered = centers.filter(center =>
      center.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (center.description && center.description.toLowerCase().includes(searchText.toLowerCase()))
    )
    setFilteredCenters(filtered)
  }, [searchText, centers])

  const loadCenters = async () => {
    setLoading(true)
    try {
      const res = await getCenters()
      setCenters(res.data)
    } catch (err) {
      showToast('Error loading centers', 'error')
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
      await deleteCenter(id)
      showToast('Center deleted successfully', 'success')
      loadCenters()
    } catch (err) {
      showToast('Error deleting center', 'error')
    }
  }

  const onFinish = async (values) => {
    try {
      if (editing) {
        await updateCenter(editing._id, values)
        showToast('Center updated successfully', 'success')
      } else {
        await createCenter(values)
        showToast('Center created successfully', 'success')
      }
      setModalVisible(false)
      loadCenters()
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving center', 'error')
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', priority: 'secondary' },
    {
      key: 'isActive',
      label: 'Status',
      render: (_, record) => record.isActive ? 'Active' : 'Inactive',
    },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} justify="space-between" align={screens.xs ? 'stretch' : 'middle'}>
          <Col xs={24} sm={12}>
            <Title level={2} style={{ margin: 0, fontSize: screens.xs ? '20px' : '28px' }}>Centers</Title>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: screens.xs ? 'left' : 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} block={screens.xs}>
              Add Center
            </Button>
          </Col>
        </Row>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <AntInput
          placeholder="Search centers..."
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
          data={filteredCenters.map(center => ({
            ...center,
            id: center._id,
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
                title="Delete Center"
                description="Are you sure you want to delete this center?"
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
        title={editing ? 'Edit Center' : 'Add New Center'}
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
            label="Center Name"
            name="name"
            rules={[{ required: true, message: 'Please enter center name' }]}
          >
            <Input placeholder="e.g., Mumbai Center" size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea placeholder="Center description" rows={4} size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {editing ? 'Update' : 'Create'} Center
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  )
}

export default Centers