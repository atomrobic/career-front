import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Skeleton, 
  Alert,
  Divider,
  Avatar,
  Row,
  Col,
  Typography,
  Space,
  Popconfirm
} from "antd";
import { 
  SaveOutlined, 
  PhoneOutlined, 
  BookOutlined, 
  ToolOutlined, 
  ExperimentOutlined, 
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { Import } from "lucide-react";
import Footer from "./Footer";

const { TextArea } = Input;
const { Title, Text } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  // Token utilities (same as original)
  const isTokenExpired = (token) => { /* ... */ };
  const refreshToken = async () => { /* ... */ };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      let token = localStorage.getItem("access_token");
      if (!token || isTokenExpired(token)) {
        token = await refreshToken();
        if (!token) {
          navigate("/login");
          return;
        }
      }

      const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = {
        education: response.data.education || "",
        skills: response.data.skills || "",
        experience: response.data.experience || "",
        personal_info: response.data.personal_info || "",
        phone_number: response.data.user?.phone_number || "",
        username: response.data.user?.username || "",
        email: response.data.user?.email || "",
      };

      setProfileData(profileData);
      form.setFieldsValue(profileData);
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const userId = JSON.parse(atob(token.split(".")[1])).user_id;
      const payload = { ...values, user: userId };

      // Try update first, fallback to create
      await axios({
        method: "PUT",
        url: "http://127.0.0.1:8000/api/profile/",
        data: payload,
        headers: { Authorization: `Bearer ${token}` },
      }).catch(async (err) => {
        if (err.response?.status === 404) {
          await axios.post("http://127.0.0.1:8000/api/profile/", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else throw err;
      });

      message.success("Profile saved successfully!");
      setProfileData(values);
      setIsEditing(false);
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to save profile");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Profile deleted successfully!");
      setProfileData(null);
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.detail || "Failed to delete profile");
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    form.setFieldsValue(profileData);
    setIsEditing(false);
  };

  useEffect(() => { fetchProfile(); }, []);

  const renderProfileView = () => {
    if (!profileData) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Title level={4}>Profile Information</Title>
          <Space>
            <Button 
              icon={<EditOutlined />} 
              type="primary" 
              onClick={startEditing}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete Profile"
              description="Are you sure you want to delete your profile information?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>
        
        <Divider />
        
        <div className="space-y-3">
          <div>
            <Text strong>Education:</Text>
            <div>{profileData.education || "Not specified"}</div>
          </div>
          
          <div>
            <Text strong>Skills:</Text>
            <div>{profileData.skills || "Not specified"}</div>
          </div>
          
          <div>
            <Text strong>Experience:</Text>
            <div>{profileData.experience || "Not specified"}</div>
          </div>
          
          <div>
            <Text strong>About Me:</Text>
            <div>{profileData.personal_info || "Not specified"}</div>
          </div>
          
          <div>
            <Text strong>Phone Number:</Text>
            <div>{profileData.phone_number || "Not specified"}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-500 p-4 md:p-8">
      <Row gutter={[24, 24]} className="max-w-6xl mx-auto">
        {/* Avatar Section */}
        <Col xs={24} md={8}>
          <Card className="shadow-lg text-center">
            {loading ? (
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            ) : (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar 
                    size={100} 
                    icon={<UserOutlined />} 
                    className="bg-blue-500" 
                  />
                  <div>
                    <Title level={4}>{profileData?.username|| "User"}</Title>
                    <Text type="secondary">{profileData?.email || "No email"}</Text>
                  </div>
                  
                  <Divider className="my-3" />
                  
                  <div className="text-left w-full">
                    {profileData?.phone_number && (
                      <div className="flex items-center space-x-2 mb-2">
                        <PhoneOutlined />
                        <Text>{profileData.phone_number}</Text>
                      </div>
                    )}
                    {profileData?.education && (
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOutlined />
                        <Text>{profileData.education}</Text>
                      </div>
                    )}
                    {profileData?.skills && (
                      <div className="flex items-center space-x-2">
                        <ToolOutlined />
                        <Text>{profileData.skills}</Text>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </Card>
        </Col>
        
        {/* Profile Form/Details Section */}
        <Col xs={24} md={16}>
          <Card
            title="Profile Settings"
            className="shadow-lg"
            headStyle={{ fontSize: "1.25rem", fontWeight: "600" }}
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : isEditing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-6"
              >
                {/* Education */}
                <Form.Item name="education" label="Education">
                  <Input 
                    prefix={<BookOutlined />} 
                    placeholder="e.g., BSc Computer Science" 
                  />
                </Form.Item>

                {/* Skills */}
                <Form.Item name="skills" label="Skills">
                  <Input
                    prefix={<ToolOutlined />}
                    placeholder="e.g., React, Python, UI/UX"
                  />
                </Form.Item>

                {/* Experience */}
                <Form.Item name="experience" label="Experience">
                  <TextArea
                    rows={4}
                    placeholder="Describe your work history..."
                  />
                </Form.Item>

                {/* Personal Info */}
                <Form.Item name="personal_info" label="About Me">
                  <TextArea
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </Form.Item>

                {/* Phone Number */}
                <Form.Item name="phone_number" label="Phone Number">
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="+1 (123) 456-7890" 
                  />
                </Form.Item>

                <Divider />

                {/* Buttons */}
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      size="large"
                    >
                      Save Profile
                    </Button>
                    <Button
                      onClick={cancelEditing}
                      icon={<CloseCircleOutlined />}
                      size="large"
                    >
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : (
              renderProfileView()
            )}
          </Card>
        </Col>
      </Row>
    </div>
    <Footer/>
    </>
  );
};

export default ProfilePage;