import { Table as AntTable, Space, Empty, Card, Row, Col, Button, Grid } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid

const Table = ({ columns, data, loading = false, actions, pagination = true }) => {
  const screens = useBreakpoint()

  // Transform columns for responsive behavior
  const tableColumns = columns
    .map(col => {
      const baseCol = {
        title: typeof col === 'string' ? col.charAt(0).toUpperCase() + col.slice(1) : col.label,
        dataIndex: typeof col === 'string' ? col : col.key,
        key: typeof col === 'string' ? col : col.key,
        render: typeof col === 'object' && col.render ? col.render : undefined,
      }

      // Hide non-essential columns on mobile
      if (!screens.md && col.priority === 'secondary') {
        baseCol.hidden = true
      }

      return baseCol
    })
    .filter(col => !col.hidden)

  if (actions) {
    tableColumns.push({
      title: 'Actions',
      key: 'actions',
      fixed: screens.md ? 'right' : undefined,
      width: screens.md ? 120 : 100,
      render: (_, record) => (
        <Space size={screens.xs ? 0 : 'small'} wrap>
          {actions(record)}
        </Space>
      ),
    })
  }

  // Card view for mobile (< md)
  if (!screens.md) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading && <div>Loading...</div>}
        {!loading && data.length === 0 && <Empty description="No data" />}
        {!loading && data.map((record, idx) => (
          <Card key={record.id || idx} size="small">
            <Row gutter={[8, 8]}>
              {columns.map(col => {
                const colKey = typeof col === 'string' ? col : col.key
                const colLabel = typeof col === 'string' ? col.charAt(0).toUpperCase() + col.slice(1) : col.label
                const value = typeof col === 'object' && col.render
                  ? col.render(record[colKey], record)
                  : record[colKey]

                return (
                  <Col span={24} key={colKey} style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>{colLabel}</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '4px' }}>{value}</div>
                  </Col>
                )
              })}
              {actions && (
                <Col span={24} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                  <Space wrap>{actions(record)}</Space>
                </Col>
              )}
            </Row>
          </Card>
        ))}
      </div>
    )
  }

  // Table view for desktop
  return (
    <AntTable
      columns={tableColumns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={pagination ? { pageSize: 10, responsive: true } : false}
      locale={{ emptyText: <Empty description="No data" /> }}
      scroll={{ x: screens.lg ? false : 800 }}
      size={screens.md ? 'middle' : 'small'}
    />
  )
}

export default Table