import amqplib from "amqplib";

const url = process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq:5672";
(async () => {
  const conn = await amqplib.connect(url);
  const ch = await conn.createChannel();
  const ex = "order.events";
  await ch.assertExchange(ex, "fanout", { durable: false });
  const q = await ch.assertQueue("", { exclusive: true });
  await ch.bindQueue(q.queue, ex, "");
  console.log("[worker] waiting for order events...");
  ch.consume(q.queue, (msg) => {
    if (!msg) return;
    const payload = JSON.parse(msg.content.toString());
    console.log("[worker] received:", payload);
    ch.ack(msg);
  });
})().catch(console.error);
