"use client";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";

// Giữ nguyên cấu trúc theo baseline TableStock của bạn
export function TableStock() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const token = Cookies.get("accessToken");

  const fetchList = async (signal?: AbortSignal) => {
    setLoading(true);
    const url = new URL("/api/products", window.location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    if (q) url.searchParams.set("q", q);
    const res = await fetch(
      url.toString().replace(window.location.origin, ""),
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal,
      }
    );
    const json = await res.json();
    setData(json.items || []);
    setTotal(json.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchList(ac.signal);
    return () => ac.abort();
  }, [q, page, pageSize]);

  const columns: ColumnsType<any> = useMemo(
    () => [
      { title: "ID", dataIndex: "id", width: 60 },
      { title: "SKU", dataIndex: "sku" },
      { title: "Tên", dataIndex: "name" },
      { title: "Giá", dataIndex: "price" },
      { title: "Tồn", dataIndex: "stock" },
      {
        title: "Thao tác",
        render: (_, row) => (
          <Space>
            <Button size="small" onClick={() => edit(row)}>
              Sửa
            </Button>
            <Button size="small" danger onClick={() => del(row.id)}>
              Xoá
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  const onSearch = (value: string) => {
    setPage(1);
    setQ(value);
  };

  const del = async (id: number) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (res.ok) fetchList();
  };

  const [form] = Form.useForm();
  const edit = (row?: any) => {
    form.resetFields();
    if (row) form.setFieldsValue(row);
    setOpen(true);
  };
  const submit = async () => {
    const v = await form.validateFields();
    const method = v.id ? "PATCH" : "POST";
    const url = v.id ? `/api/products/${v.id}` : "/api/products";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(v),
    });
    if (res.ok) {
      setOpen(false);
      fetchList();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-2">
        <Input.Search
          allowClear
          placeholder="Tìm theo SKU/Tên"
          onSearch={onSearch}
          enterButton
          style={{ maxWidth: 360 }}
        />
        <div className="flex items-center gap-2">
          <Button type="primary" onClick={() => edit()}>
            Thêm sản phẩm
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        size="middle"
      />
      <div className="mt-4 flex justify-end">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
          showSizeChanger
          pageSizeOptions={[25, 50, 100, 200]}
        />
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        title="Sản phẩm"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item label="Tồn" name="stock" rules={[{ required: true }]}>
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
