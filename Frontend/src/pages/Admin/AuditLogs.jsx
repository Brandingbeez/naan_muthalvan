import { useEffect, useState } from 'react'
import { Card, Typography, Row, Col, Tag, Empty, Spin, Space, Button, Input, Grid } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AdminLayout from '../../components/AdminLayout'
import Table from '../../components/Table'
import { getAuditLogs } from '../../api/admin'
import { showToast } from '../../components/Toast'

dayjs.extend(relativeTime)

const { Title, Text, Paragraph } = Typography
const { useBreakpoint } = Grid

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const screens = useBreakpoint()

  useEffect(() => {
    loadLogs()
  }, [])

  useEffect(() => {
    const filtered = logs.filter(log =>
      log.action.toLowerCase().includes(searchText.toLowerCase()) ||
      log.actorType.toLowerCase().includes(searchText.toLowerCase()) ||
      (log.requestId && log.requestId.toLowerCase().includes(searchText.toLowerCase()))
    )
    setFilteredLogs(filtered)
  }, [searchText, logs])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const res = await getAuditLogs()
      setLogs(res.data)
    } catch (err) {
      showToast('Error loading audit logs', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'success'
    if (statusCode >= 400 && statusCode < 500) return 'warning'
    if (statusCode >= 500) return 'error'
    return 'default'
  }

  const getActionColor = (action) => {
    const colors = {
      'login': 'blue',
      'logout': 'gray',
      'create': 'green',
      'update': 'orange',
      'delete': 'red',
      'view': 'cyan',
      'export': 'purple',
    }
    return colors[action.toLowerCase()] || 'default'
  }

  const columns = [
    { key: 'action', label: 'Action', render: (_, record) => <Tag color={getActionColor(record.action)}>{record.action}</Tag> },
    { key: 'actorType', label: 'Actor Type', priority: 'secondary', render: (_, record) => <Tag>{record.actorType}</Tag> },
    { key: 'statusCode', label: 'Status', priority: 'secondary', render: (_, record) => <Tag color={getStatusColor(record.statusCode)}>{record.statusCode}</Tag> },
    {
      key: 'createdAt',
      label: 'Timestamp',
      render: (_, record) => (
        <Text type="secondary" style={{ fontSize: screens.xs ? '12px' : '14px' }}>
          {dayjs(record.createdAt).format('MMM DD, YYYY HH:mm:ss')}
        </Text>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ fontSize: screens.xs ? '20px' : '28px', margin: 0 }}>Audit Logs</Title>
        <Paragraph type="secondary" style={{ marginTop: '8px' }}>
          System activity and user action logs for compliance and monitoring
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={18}>
          <Input
            placeholder="Search by action, actor type, or request ID..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            size="large"
            style={{ borderRadius: '6px' }}
          />
        </Col>
        <Col xs={24} sm={6}>
          <Button
            onClick={loadLogs}
            icon={<ReloadOutlined />}
            block
            size="large"
          >
            {screens.xs ? '' : 'Refresh'}
          </Button>
        </Col>
      </Row>

      <Card loading={loading}>
        {filteredLogs.length === 0 ? (
          <Empty description="No audit logs found" />
        ) : (
          <Table
            columns={columns}
            data={filteredLogs.map(log => ({
              ...log,
              id: log._id,
            }))}
            pagination
          />
        )}
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <Title level={4} style={{ fontSize: screens.xs ? '16px' : '18px' }}>Log Details</Title>
        <ul style={{ fontSize: screens.xs ? '13px' : '14px' }}>
          <li><strong>Action:</strong> The operation performed (login, create, update, delete, etc.)</li>
          <li><strong>Actor Type:</strong> Type of user who performed the action (admin, user, system)</li>
          <li><strong>Status:</strong> HTTP status code of the operation</li>
          <li><strong>Timestamp:</strong> When the action occurred</li>
          <li><strong>Request ID:</strong> Unique identifier for tracking requests</li>
        </ul>
      </Card>
    </AdminLayout>
  )
}

export default AuditLogs