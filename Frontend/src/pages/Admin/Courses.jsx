import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Popconfirm,
  Select,
  Grid,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import Table from "../../components/Table";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCenters,
} from "../../api/admin";
import { showToast } from "../../components/Toast";

const { Title } = Typography;
const { useBreakpoint } = Grid;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) => {
      const title = (course.title || "").toLowerCase();
      const code = (course.courseCode || "").toLowerCase();
      const language = (course.language || "").toLowerCase();
      const s = searchText.toLowerCase();

      return title.includes(s) || code.includes(s) || language.includes(s);
    });

    setFilteredCourses(filtered);
  }, [searchText, courses]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesRes, centersRes] = await Promise.all([
        getCourses(),
        getCenters(),
      ]);
      setCourses(coursesRes.data || []);
      setCenters(centersRes.data || []);
    } catch (err) {
      showToast("Error loading courses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      centerId: record.centerId?._id || record.centerId, // supports populated or plain id
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      showToast("Course deleted successfully", "success");
      loadData();
    } catch (err) {
      showToast("Error deleting course", "error");
    }
  };

  const onFinish = async (values) => {
    try {
      if (editing?._id) {
        await updateCourse(editing._id, values);
        showToast("Course updated successfully", "success");
      } else {
        await createCourse(values);
        showToast("Course created successfully", "success");
      }
      setModalVisible(false);
      loadData();
    } catch (err) {
      showToast(err?.response?.data?.message || "Error saving course", "error");
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "courseCode", label: "Course Code" },
    { key: "language", label: "Language", priority: "secondary" },
    {
      key: "courseType",
      label: "Type",
      priority: "secondary",
      render: (_, record) => (
        <span style={{ textTransform: "capitalize" }}>
          {record.courseType || "online"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (_, record) => (record.isActive ? "Active" : "Inactive"),
    },
    {
      key: "nmPublished",
      label: "NM Status",
      priority: "secondary",
      render: (_, record) =>
        record.nmPublished ? "Published" : "Not Published",
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <Row
          gutter={[16, 16]}
          justify="space-between"
          align={screens.xs ? "stretch" : "middle"}
        >
          <Col xs={24} sm={12}>
            <Title
              level={2}
              style={{ margin: 0, fontSize: screens.xs ? 20 : 28 }}
            >
              Courses
            </Title>
          </Col>
          <Col
            xs={24}
            sm={12}
            style={{ textAlign: screens.xs ? "left" : "right" }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              block={screens.xs}
            >
              Add Course
            </Button>
          </Col>
        </Row>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search courses..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="large"
          style={{ borderRadius: 6 }}
        />
      </Card>

      <Card loading={loading}>
        <Table
          columns={columns}
          data={filteredCourses.map((course) => ({
            ...course,
            id: course._id,
          }))}
          actions={(row) => (
            <Space>
              <Button
                type="primary"
                ghost
                icon={<EditOutlined />}
                onClick={() => handleEdit(row)}
                size="small"
              >
                {!screens.xs && "Edit"}
              </Button>

              <Popconfirm
                title="Delete Course"
                description="Are you sure you want to delete this course?"
                onConfirm={() => handleDelete(row.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />} size="small">
                  {!screens.xs && "Delete"}
                </Button>
              </Popconfirm>
            </Space>
          )}
          pagination
        />
      </Card>

      <Modal
        title={editing ? "Edit Course" : "Add New Course"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={screens.xs ? "100%" : 600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Center"
            name="centerId"
            rules={[{ required: true, message: "Please select a center" }]}
          >
            <Select
              placeholder="Select a center"
              options={centers.map((c) => ({ label: c.name, value: c._id }))}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Course Title"
            name="title"
            rules={[{ required: true, message: "Please enter course title" }]}
          >
            <Input placeholder="e.g., Mathematics 101" size="large" />
          </Form.Item>

          <Form.Item
            label="Course Code"
            name="courseCode"
            rules={[{ required: true, message: "Please enter course code" }]}
          >
            <Input placeholder="e.g., MATH101" size="large" />
          </Form.Item>

          <Form.Item label="Language" name="language">
            <Input placeholder="e.g., English, Tamil" size="large" />
          </Form.Item>

          <Form.Item
            label="Course Type"
            name="courseType"
            rules={[{ required: true, message: "Please select course type" }]}
          >
            <Select
              placeholder="Select course type"
              options={[
                { label: "Online", value: "online" },
                { label: "Offline", value: "offline" },
              ]}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea
              placeholder="Course description"
              rows={4}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Image URL (optional)" name="imageUrl">
            <Input placeholder="https://..." size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {editing ? "Update" : "Create"} Course
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default Courses;
