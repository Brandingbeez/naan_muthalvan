import { Spin, Flex } from 'antd'

const Loading = ({ size = 'large', tip = 'Loading...' }) => (
  <Flex justify="center" align="center" style={{ minHeight: '200px' }}>
    <Spin size={size} tip={tip} />
  </Flex>
)

export default Loading