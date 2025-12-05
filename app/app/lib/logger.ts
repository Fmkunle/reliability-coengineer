// app/lib/logger.ts
import { randomUUID } from "crypto";

export async function logRequest<T>(handler: () => Promise<T>) {
  const requestId = randomUUID();
  const start = Date.now();

  try {
    const result = await handler();
    return result;
  } finally {
    const latency = Date.now() - start;
    console.log(
      JSON.stringify({
        requestId,
        latencyMs: latency,
        timestamp: new Date().toISOString()
      })
    );
  }
}
