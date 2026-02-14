import { message } from 'antd'

const showToast = (msg, type = 'success') => {
  if (type === 'success') {
    message.success(msg)
  } else if (type === 'error') {
    message.error(msg)
  } else if (type === 'warning') {
    message.warning(msg)
  } else {
    message.info(msg)
  }
}

const Toast = ({ message: msg, type = 'success' }) => {
  if (msg) {
    showToast(msg, type)
  }
  return null
}

export { showToast }
export default Toast