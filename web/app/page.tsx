"use client";
import { TableStock } from "@/components/TableStock";
import { Button } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const token = Cookies.get("accessToken");
  const [authed, setAuthed] = useState(Boolean(token));

  useEffect(() => setAuthed(Boolean(Cookies.get("accessToken"))), []);

  if (!authed) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Bảng sản phẩm (demo)</h1>
        <p className="mb-4">
          Bạn chưa đăng nhập. Một số thao tác sẽ bị hạn chế.
        </p>
        <Link href="/login">
          <Button type="primary">Đăng nhập</Button>
        </Link>
        <div className="mt-8">
          <TableStock />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Quản trị kho</h1>
        <Button
          onClick={() => {
            Cookies.remove("accessToken");
            location.reload();
          }}
        >
          Đăng xuất
        </Button>
      </div>
      <TableStock />
    </main>
  );
}
