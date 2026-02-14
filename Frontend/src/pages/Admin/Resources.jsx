import { useEffect, useState } from 'react'
import { Modal, Form, Input, Button, Card, Space, Typography, Row, Col, Popconfirm, Select, Upload, Progress, Empty, Tag, Tooltip, Grid } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined, FileOutlined, YoutubeOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined, VideoCameraOutlined  } from '@ant-design/icons'
import AdminLayout from '../../components/AdminLayout'
import Table from '../../components/Table'
import { getResources, uploadFileResource, uploadYoutubeResource, updateResource, deleteResource, getSessions } from '../../api/admin'
import { showToast } from '../../components/Toast'

const { Title } = Typography
const { useBreakpoint } = Grid

const FILE_UPLOAD_CONFIG = {
  pdf: { label: 'PDF Document', icon: <FilePdfOutlined />, maxSize: 52428800 }, // 50MB
  ppt: { label: 'PowerPoint', icon: <FileOutlined />, maxSize: 104857600 }, // 100MB
  docs: { label: 'Word Document', icon: <FileWordOutlined />, maxSize: 26214400 }, // 25MB
  sheets: { label: 'Excel Sheet', icon: <FileExcelOutlined />, maxSize: 52428800 }, // 50MB
  video: { label: 'Video', icon: <VideoCameraOutlined  />, maxSize: 536870912 }, // 500MB
}

const Resources = () => {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [uploadType, setUploadType] = useState(null) // 'file' or 'youtube'
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()
  const screens = useBreakpoint()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = resources.filter(resource =>
      resource.title.toLowerCase().includes(searchText.toLowerCase())
    )
    setFilteredResources(filtered)
  }, [searchText, resources])

  const loadData = async () => {
    setLoading(true)
    try {
      const [resourcesRes, sessionsRes] = await Promise.all([
        getResources(),
        getSessions(),
      ])
      setResources(resourcesRes.data)
      setSessions(sessionsRes.data)
    } catch (err) {
      showToast('Error loading resources', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = (type) => {
    setUploadType(type)
    form.resetFields()
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteResource(id)
      showToast('Resource deleted successfully', 'success')
      loadData()
    } catch (err) {
      showToast('Error deleting resource', 'error')
    }
  }

  const onFinish = async (values) => {
    try {
      setUploading(true)
      setUploadProgress(0)

      if (uploadType === 'file') {
        const file = values.file?.fileList?.[0]?.originFileObj
        if (!file) {
          showToast('Please select a file', 'error')
          return
        }

        await uploadFileResource(
          values.sessionId,
          file,
          values.title,
          values.description || ''
        )
        showToast('File resource uploaded successfully', 'success')
      } else if (uploadType === 'youtube') {
        await uploadYoutubeResource(
          values.sessionId,
          values.youtubeUrl,
          values.title,
          values.description || ''
        )
        showToast('YouTube resource created successfully', 'success')
      }

      setModalVisible(false)
      setUploadProgress(0)
      loadData()
    } catch (err) {
      showToast(err.response?.data?.error || 'Error uploading resource', 'error')
    } finally {
      setUploading(false)
    }
  }

  const getResourceIcon = (resource) => {
    if (resource.type === 'youtube') {
      return <YoutubeOutlined style={{ color: '#ff0000' }} />
    }
    if (resource.category === 'pdf') return <FilePdfOutlined style={{ color: '#d9534f' }} />
    if (resource.category === 'ppt') return <FileOutlined style={{ color: '#ff6600' }} />
    if (resource.category === 'docs') return <FileWordOutlined style={{ color: '#2e75b6' }} />
    if (resource.category === 'sheets') return <FileExcelOutlined style={{ color: '#70ad47' }} />
    if (resource.category === 'video') return <VideoCameraOutlined  style={{ color: '#9c27b0' }} />
    return <FileOutlined />
  }

  const getCategoryLabel = (resource) => {
    if (resource.type === 'youtube') return 'YouTube'
    return resource.category?.toUpperCase() || 'FILE'
  }

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (_, resource) => (
        <Space>
          {getResourceIcon(resource)}
          <span>{resource.title}</span>
        </Space>
      ),
    },
    {
      key: 'category',
      label: 'Type',
      priority: 'secondary',
      render: (_, resource) => (
        <Tag color={resource.type === 'youtube' ? 'red' : 'blue'}>
          {getCategoryLabel(resource)}
        </Tag>
      ),
    },
    {
      key: 'fileSize',
      label: 'Size',
      priority: 'secondary',
      render: (_, resource) => {
        if (!resource.sizeBytes) return '-'
        const mb = (resource.sizeBytes / 1024 / 1024).toFixed(2)
        return `${mb} MB`
      },
    },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} justify="space-between" align={screens.xs ? 'stretch' : 'middle'}>
          <Col xs={24} sm={12}>
            <Title level={2} style={{ margin: 0, fontSize: screens.xs ? '20px' : '28px' }}>Resources</Title>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: screens.xs ? 'left' : 'right' }}>
            <Space wrap>
              <Tooltip title="Upload a file resource (PDF, PPT, DOC, XLS, Video)">
                <Button 
                  type="primary" 
                  icon={<UploadOutlined />} 
                  onClick={() => handleAdd('file')}
                  block={screens.xs}
                >
                  {screens.xs ? '' : 'Upload File'}
                </Button>
              </Tooltip>
              <Tooltip title="Add a YouTube link">
                <Button 
                  type="default" 
                  icon={<YoutubeOutlined />} 
                  onClick={() => handleAdd('youtube')}
                  block={screens.xs}
                >
                  {screens.xs ? '' : 'Add YouTube'}
                </Button>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Search resources..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          size="large"
          style={{ borderRadius: '6px' }}
        />
      </Card>

      <Card loading={loading}>
        {filteredResources.length === 0 ? (
          <Empty description="No resources found" />
        ) : (
          <Table
            columns={columns}
            data={filteredResources.map(resource => ({
              ...resource,
              id: resource._id,
            }))}
            actions={(row) => (
              <Space>
                <Popconfirm
                  title="Delete Resource"
                  description="Are you sure you want to delete this resource?"
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
        )}
      </Card>

      <Modal
        title={
          uploadType === 'file' 
            ? 'Upload File Resource' 
            : 'Add YouTube Resource'
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setUploadProgress(0)
        }}
        footer={null}
        width={screens.xs ? '100%' : 600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={uploading}
        >
          <Form.Item
            label="Session *"
            name="sessionId"
            rules={[{ required: true, message: 'Please select a session' }]}
          >
            <Select
              placeholder="Select a session"
              options={sessions.map(s => ({ label: s.title, value: s._id }))}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Title *"
            name="title"
            rules={[{ required: true, message: 'Please enter resource title' }]}
          >
            <Input placeholder="e.g., Lecture Slides, Introduction Video" size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea 
              placeholder="Optional description"
              rows={3}
              size="large"
            />
          </Form.Item>

          {uploadType === 'file' && (
            <Form.Item
              label="File *"
              name="file"
              rules={[
                { required: true, message: 'Please select a file' }
              ]}
            >
              <Upload 
                maxCount={1}
                beforeUpload={() => false}
                accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.mp4,.webm"
              >
                <Button icon={<UploadOutlined />}>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
          )}

          {uploadType === 'youtube' && (
            <Form.Item
              label="YouTube URL *"
              name="youtubeUrl"
              rules={[
                { required: true, message: 'Please enter YouTube URL' },
                { pattern: /^(https?:\/\/)?(www\.)?youtube\.com\/.*|youtu\.be\/.*$/, message: 'Invalid YouTube URL' }
              ]}
            >
              <Input placeholder="https://www.youtube.com/watch?v=..." size="large" />
            </Form.Item>
          )}

          {uploading && (
            <Form.Item>
              <Progress 
                percent={uploadProgress} 
                status={uploading ? 'active' : 'success'}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              size="large"
              loading={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  )
}

export default Resources