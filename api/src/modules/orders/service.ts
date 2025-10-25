import { env } from "@/config/env.js";
import { prisma } from "@/lib/prisma.js";
import { Decimal } from "@prisma/client/runtime/library";
import amqplib from "amqplib";

export async function createOrder(payload: {
  userId?: number;
  items: { productId: number; quantity: number }[];
}) {
  const code = `ODR-${Date.now()}`;
  const itemsDb = await prisma.product.findMany({
    where: { id: { in: payload.items.map((i) => i.productId) } },
  });
  const items = payload.items.map((i) => {
    const p = itemsDb.find((x) => x.id === i.productId)!;
    return { productId: i.productId, quantity: i.quantity, price: p.price };
  });
  const total = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const order = await prisma.$transaction(async (tx) => {
    // reduce stock
    for (const i of payload.items) {
      await tx.product.update({
        where: { id: i.productId },
        data: { stock: { decrement: i.quantity } },
      });
    }
    const created = await tx.order.create({
      data: {
        code,
        userId: payload.userId,
        total: new Decimal(total),
        items: { create: items },
      },
    });
    await tx.activityLog.create({
      data: {
        actorId: payload.userId,
        action: "order.created",
        meta: { orderId: created.id, code },
      },
    });
    return created;
  });

  // publish event
  const conn = await amqplib.connect(env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  const ex = "order.events";
  await ch.assertExchange(ex, "fanout", { durable: false });
  ch.publish(
    ex,
    "",
    Buffer.from(
      JSON.stringify({ type: "order.created", orderId: order.id, code })
    )
  );
  await ch.close();
  await conn.close();

  return order;
}
