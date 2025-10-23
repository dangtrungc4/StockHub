# StockHub
Có gì trong project?

API (Node.js + TS + Express + Prisma + MariaDB): Auth JWT, RBAC, CRUD sản phẩm/đơn hàng/người dùng, upload, health check, publish event order.created lên RabbitMQ.

Worker (RabbitMQ): Consumer lắng nghe sự kiện đơn hàng (demo nền tảng xử lý async).

Web (Next.js + Ant Design + Tailwind): Trang đăng nhập + bảng quản lý TableStock theo đúng baseline của bạn (tìm kiếm, phân trang 25/50/100/200, thêm/sửa/xoá sản phẩm).

Nginx: reverse proxy /api → api:4000, web ở :3000.

Hạ tầng: MariaDB, Redis, RabbitMQ, volumes data & uploads.
