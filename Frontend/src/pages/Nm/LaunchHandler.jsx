import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Spin, Layout, Result, Grid } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid

const LaunchHandler = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const screens = useBreakpoint()

  useEffect(() => {
    const token = searchParams.get('token')
    const timer = setTimeout(() => {
      if (token) {
        navigate('/')
      } else {
        navigate('/')
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [searchParams, navigate])

  return (
    <Layout style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: screens.xs ? '16px' : '24px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
        <Result
          icon={<Spin indicator={<LoadingOutlined style={{ fontSize: screens.xs ? '36px' : '48px' }} spin />} />}
          title={screens.xs ? 'Processing...' : 'Processing Your Request'}
          subTitle={screens.xs ? 'Redirecting you...' : 'Please wait while we redirect you...'}
          style={{ maxWidth: screens.xs ? '100%' : '600px' }}
        />
      </div>
    </Layout>
  )
}

export default LaunchHandler