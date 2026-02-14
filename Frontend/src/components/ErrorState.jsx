import { Result, Button } from 'antd'

const ErrorState = ({ error, retry }) => (
  <Result
    status="error"
    title="Error"
    subTitle={error || 'Something went wrong. Please try again.'}
    extra={<Button type="primary" onClick={retry}>
      Retry
    </Button>}
  />
)

export default ErrorState