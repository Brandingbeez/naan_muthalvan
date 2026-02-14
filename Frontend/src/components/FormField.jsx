import { Input, InputNumber, Form } from 'antd'

const FormField = ({ label, type, value, onChange, error, placeholder, required, formItem }) => {
  if (formItem) {
    // Use as wrapper for Ant Form
    return formItem
  }

  const handleChange = (e) => {
    if (type === 'number') {
      onChange(e)
    } else if (type === 'textarea') {
      onChange(e.target.value)
    } else {
      onChange(e.target.value)
    }
  }

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={error ? 'error' : ''}
      help={error}
      style={{ marginBottom: '16px' }}
    >
      {type === 'textarea' ? (
        <Input.TextArea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          size="large"
        />
      ) : type === 'number' ? (
        <InputNumber
          value={value}
          onChange={handleChange}
          className="w-full"
          size="large"
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          size="large"
        />
      )}
    </Form.Item>
  )
}

export default FormField