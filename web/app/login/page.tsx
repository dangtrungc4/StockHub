"use client";
import { Button, Form, Input, message } from "antd";
import Cookies from "js-cookie";

export default function LoginPage() {
  const onFinish = async (values: any) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) return message.error("Đăng nhập thất bại");
    const data = await res.json();
    Cookies.set("accessToken", data.token);
    message.success("Đăng nhập thành công");
    location.href = "/";
  };
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Đăng nhập</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="admin123" />
          </Form.Item>
          <Button block type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form>
      </div>
    </main>
  );
}
