import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const showConfirm = ({ title = 'Confirm', message, onConfirm, onCancel, okText = 'Yes', cancelText = 'No' }) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content: message,
    okText,
    cancelText,
    onOk: onConfirm,
    onCancel: onCancel || (() => {}),
  })
}

const ConfirmDialog = ({ title, message, onConfirm, onCancel, okText, cancelText }) => {
  showConfirm({ title, message, onConfirm, onCancel, okText, cancelText })
  return null
}

export { showConfirm }
export default ConfirmDialog