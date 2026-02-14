import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Layout, Grid } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { adminLogin } from "../../api/admin";
import { useAdminAuth } from "../../auth/AdminAuthContext";
import { showToast } from "../../components/Toast";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await adminLogin({
        email: values.email,
        password: values.password,
      });
      login(res.data.token, res.data.admin);
      showToast("Login successful!", "success");
      navigate("/admin");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: screens.xs ? "16px" : "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Card
          style={{
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            border: "none",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Title
              level={2}
              style={{
                marginBottom: "8px",
                color: "#1890ff",
                fontSize: screens.xs ? "24px" : "32px",
              }}
            >
              BB LMS
            </Title>
            <Paragraph type="secondary">Admin Panel</Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="admin@example.com"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>

          <Paragraph
            type="secondary"
            style={{
              textAlign: "center",
              fontSize: "12px",
              marginTop: "16px",
            }}
          >
            Use the default admin credentials
          </Paragraph>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
