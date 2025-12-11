import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import ForgotPasswordApi from "./ForgotPasswordApi"; // API file

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await ForgotPasswordApi.sendResetLink(values.email);
      if (res.data?.success) {
        message.success("Password reset link sent to your email!");
      } else {
        message.error(res.data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card title="Forgot Password" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
