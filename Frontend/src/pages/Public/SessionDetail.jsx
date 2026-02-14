import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getResources } from '../../api/public'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import ErrorState from '../../components/ErrorState'
import { Row, Col, Card, Button, Typography, Breadcrumb, Divider, Space, Alert, Modal, Spin, Tag, Grid, Empty } from 'antd'
import { DownloadOutlined, PlayCircleOutlined, FileOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined, VideoCameraOutlined, EyeOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { useBreakpoint } = Grid

const getFileIcon = (category) => {
  switch (category) {
    case 'pdf': return <FilePdfOutlined style={{ color: '#d9534f', fontSize: '32px' }} />
    case 'ppt': return <FileOutlined style={{ color: '#ff6600', fontSize: '32px' }} />
    case 'docs': return <FileWordOutlined style={{ color: '#2e75b6', fontSize: '32px' }} />
    case 'sheets': return <FileExcelOutlined style={{ color: '#70ad47', fontSize: '32px' }} />
    case 'video': return <VideoCameraOutlined style={{ color: '#9c27b0', fontSize: '32px' }} />
    default: return <FileOutlined style={{ color: '#666', fontSize: '32px' }} />
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case 'pdf': return 'volcano'
    case 'ppt': return 'orange'
    case 'docs': return 'blue'
    case 'sheets': return 'green'
    case 'video': return 'purple'
    default: return 'default'
  }
}

const SessionDetail = () => {
  const screens = useBreakpoint()
  const { sessionId } = useParams()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewResource, setPreviewResource] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  useEffect(() => {
    getResources(sessionId)
      .then(res => setResources(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [sessionId])

  const handlePreview = (resource) => {
    setPreviewResource(resource)
    setPreviewVisible(true)
    setPreviewLoading(true)
  }

  const getTitleFontSize = () => screens.xs ? '24px' : screens.sm ? '28px' : '32px'
  const getSubtitleFontSize = () => screens.xs ? '14px' : '16px'
  const getSectionTitleFontSize = () => screens.xs ? '16px' : screens.sm ? '18px' : '22px'
  const getVideoHeight = () => screens.xs ? 200 : screens.sm ? 280 : 360
  const getModalWidth = screens.xs ? '100%' : screens.sm ? '90%' : '1200px'
  const getPreviewHeight = screens.xs ? 400 : screens.sm ? 500 : 600

  if (loading) return <Layout><Loading /></Layout>
  if (error) return <Layout><ErrorState error={error} retry={() => window.location.reload()} /></Layout>

  const videos = resources.filter(r => r.type === 'youtube')
  const files = resources.filter(r => r.type === 'file')

  return (
    <Layout>
      <div style={{ marginBottom: screens.xs ? '16px' : screens.sm ? '20px' : '24px', padding: screens.xs ? '0 8px' : '0' }}>
        <div style={{
          fontSize: screens.xs ? '12px' : '14px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: screens.xs ? '6px' : '8px'
        }}>
          <Link to="/" style={{ color: '#1890ff' }}>Home</Link>
          <span>/</span>
          <span>Session</span>
        </div>
      </div>

      <div style={{ marginBottom: screens.xs ? '24px' : screens.sm ? '32px' : '40px', padding: screens.xs ? '0 8px' : '0' }}>
        <Title level={1} style={{
          fontSize: getTitleFontSize(),
          margin: '0 0 12px 0'
        }}>
          Session Resources
        </Title>
        <Paragraph style={{
          fontSize: getSubtitleFontSize(),
          color: '#666',
          margin: 0
        }}>
          Access all learning materials, videos, and downloadable resources for this session
        </Paragraph>
      </div>

      {resources.length === 0 ? (
        <Empty description="No resources available at this time." />
      ) : (
        <>
          {videos.length > 0 && (
            <div style={{ marginBottom: screens.xs ? '32px' : screens.sm ? '40px' : '48px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: screens.xs ? '16px' : screens.sm ? '20px' : '24px',
                fontSize: getSectionTitleFontSize(),
                fontWeight: 600,
                padding: screens.xs ? '0 8px' : '0'
              }}>
                <PlayCircleOutlined style={{ marginRight: '12px', color: '#d9534f', fontSize: screens.xs ? '20px' : '24px' }} />
                Video Lectures
              </div>
              <Row gutter={[screens.xs ? 12 : screens.sm ? 16 : 24, screens.xs ? 12 : screens.sm ? 16 : 24]}>
                {videos.map(video => (
                  <Col key={video._id} xs={24} sm={12} md={8} lg={6}>
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
                          background: '#000',
                          height: getVideoHeight(),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          width: '100%'
                        }}>
                          <iframe
                            width="100%"
                            height={getVideoHeight()}
                            src={video.youtubeUrl.includes('watch?v=')
                              ? video.youtubeUrl.replace('watch?v=', 'embed/')
                              : video.youtubeUrl.includes('youtu.be/')
                              ? video.youtubeUrl.replace('youtu.be/', 'youtube.com/embed/')
                              : video.youtubeUrl}
                            title={video.title}
                            allowFullScreen
                            style={{
                              border: 'none',
                              display: 'block'
                            }}
                          />
                        </div>
                      }
                    >
                      <Card.Meta
                        title={<Text strong style={{ fontSize: screens.xs ? '13px' : '14px' }}>{video.title}</Text>}
                        description={
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ fontSize: screens.xs ? '12px' : '13px', margin: '8px 0 0 0' }}
                          >
                            {video.description || 'Video lecture'}
                          </Paragraph>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {files.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: screens.xs ? '16px' : screens.sm ? '20px' : '24px',
                fontSize: getSectionTitleFontSize(),
                fontWeight: 600,
                padding: screens.xs ? '0 8px' : '0'
              }}>
                <FileOutlined style={{ marginRight: '12px', color: '#2e75b6', fontSize: screens.xs ? '20px' : '24px' }} />
                Downloadable Resources
              </div>
              <Row gutter={[screens.xs ? 12 : screens.sm ? 16 : 24, screens.xs ? 12 : screens.sm ? 16 : 24]}>
                {files.map(file => (
                  <Col key={file._id} xs={24} sm={12} md={8} lg={6}>
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
                          background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                          height: screens.xs ? 100 : screens.sm ? 120 : 140,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          {getFileIcon(file.category)}
                        </div>
                      }
                    >
                      <Card.Meta
                        title={<Text strong style={{ fontSize: screens.xs ? '13px' : '14px' }}>{file.title}</Text>}
                      />
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <Text ellipsis style={{ fontSize: screens.xs ? '11px' : '12px', color: '#666' }}>
                            {file.originalFileName}
                          </Text>
                          {file.sizeBytes && (
                            <Text style={{ fontSize: screens.xs ? '11px' : '12px', color: '#999' }}>
                              {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                            </Text>
                          )}
                          <Tag color={getCategoryColor(file.category)}>
                            {file.category?.toUpperCase() || 'FILE'}
                          </Tag>
                          {file.description && (
                            <Text
                              ellipsis={{ rows: 2 }}
                              style={{ fontSize: screens.xs ? '11px' : '12px' }}
                            >
                              {file.description}
                            </Text>
                          )}
                        </div>
                      </div>
                      <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {file.previewUrl && (
                          <Button
                            type="default"
                            icon={<EyeOutlined />}
                            block
                            onClick={() => handlePreview(file)}
                            size={screens.xs ? 'small' : 'middle'}
                            style={{ fontSize: screens.xs ? '12px' : '14px' }}
                          >
                            Preview
                          </Button>
                        )}
                        {file.downloadUrl && (
                          <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Button
                              type="primary"
                              icon={<DownloadOutlined />}
                              block
                              size={screens.xs ? 'small' : 'middle'}
                              style={{ fontSize: screens.xs ? '12px' : '14px' }}
                            >
                              Download
                            </Button>
                          </a>
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </>
      )}

      <Modal
        title={previewResource?.title}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={getModalWidth}
        style={{
          maxWidth: screens.xs ? '100vw' : '90vw'
        }}
        footer={null}
        bodyStyle={{
          padding: screens.xs ? '12px' : screens.sm ? '16px' : '24px',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto'
        }}
      >
        <Spin spinning={previewLoading}>
          {previewResource && (
            <div style={{ marginTop: screens.xs ? '12px' : '16px' }}>
              {previewResource.category === 'pdf' && previewResource.previewUrl && (
                <iframe
                  src={previewResource.previewUrl}
                  style={{
                    width: '100%',
                    height: getPreviewHeight(),
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  title="PDF Preview"
                  onLoad={() => setPreviewLoading(false)}
                />
              )}
              {previewResource.category === 'video' && previewResource.previewUrl && (
                <video
                  style={{
                    width: '100%',
                    maxHeight: getPreviewHeight(),
                    borderRadius: '4px'
                  }}
                  controls
                  onCanPlay={() => setPreviewLoading(false)}
                >
                  <source src={previewResource.previewUrl} type={previewResource.mimeType} />
                  Your browser does not support the video tag.
                </video>
              )}
              {!['pdf', 'video'].includes(previewResource.category) && (
                <Alert
                  message="Preview not available"
                  description={`Preview is not available for ${previewResource.category?.toUpperCase() || 'this file'} files. Please download to view.`}
                  type="info"
                  showIcon
                  onClose={() => setPreviewLoading(false)}
                />
              )}
            </div>
          )}
        </Spin>
      </Modal>
    </Layout>
  )
}

export default SessionDetail