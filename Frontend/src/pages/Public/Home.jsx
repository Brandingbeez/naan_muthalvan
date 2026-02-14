import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCenters } from '../../api/public'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'
import { Row, Col, Card, Button, Typography, Input, Grid, Empty } from 'antd'
import { RightOutlined, EnvironmentOutlined, SearchOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { useBreakpoint } = Grid

const Home = () => {
  const screens = useBreakpoint()
  const [centers, setCenters] = useState([])
  const [filteredCenters, setFilteredCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getCenters()
      .then(res => setCenters(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const filtered = centers.filter(center =>
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (center.description && center.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredCenters(filtered)
  }, [searchQuery, centers])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const getTitleFontSize = () => screens.xs ? '24px' : screens.sm ? '28px' : '32px'
  const getSubtitleFontSize = () => screens.xs ? '14px' : '16px'
  const getCoverHeight = () => screens.xs ? 120 : screens.sm ? 140 : 160
  const getIconSize = () => screens.xs ? '40px' : screens.sm ? '48px' : '56px'

  if (loading) return <Layout><Loading /></Layout>
  if (error) return <Layout><ErrorState error={error} retry={() => window.location.reload()} /></Layout>

  return (
    <Layout>
      <div style={{ marginBottom: screens.xs ? '24px' : screens.sm ? '32px' : '40px', padding: screens.xs ? '0 8px' : '0' }}>
        <Title level={1} style={{ fontSize: getTitleFontSize(), margin: '0 0 12px 0' }}>
          Welcome to BB LMS
        </Title>
        <Paragraph style={{ fontSize: getSubtitleFontSize(), marginBottom: screens.xs ? '16px' : '24px' }}>
          Explore our learning centers and discover comprehensive courses tailored to your educational needs.
        </Paragraph>

        {centers.length > 0 && (
          <Input
            placeholder="Search centers..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              height: screens.xs ? '40px' : '44px',
              fontSize: screens.xs ? '14px' : '16px',
              marginBottom: screens.xs ? '16px' : '24px'
            }}
            allowClear
          />
        )}
      </div>

      {filteredCenters.length === 0 ? (
        <Empty description={searchQuery ? 'No centers match your search' : 'No centers available'} />
      ) : (
        <Row gutter={[screens.xs ? 12 : screens.sm ? 16 : 24, screens.xs ? 12 : screens.sm ? 16 : 24]}>
          {filteredCenters.map(center => (
            <Col key={center._id} xs={24} sm={12} md={8} lg={6}>
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
                    background: 'linear-gradient(135deg, #5DADE2 0%, #7D3C98 100%)',
                    height: getCoverHeight(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <EnvironmentOutlined style={{ fontSize: getIconSize() }} />
                  </div>
                }
              >
                <Card.Meta
                  title={<Text strong style={{ fontSize: screens.xs ? '14px' : '16px' }}>{center.name}</Text>}
                  description={
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ fontSize: screens.xs ? '12px' : '14px', margin: '8px 0 0 0' }}
                    >
                      {center.description || 'Learn from our comprehensive course catalog'}
                    </Paragraph>
                  }
                />
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to={`/centers/${center._id}`}>
                    <Button
                      type="primary"
                      icon={<RightOutlined />}
                      size={screens.xs ? 'small' : 'middle'}
                    >
                      View Courses
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

export default Home