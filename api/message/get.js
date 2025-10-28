import { getConnecterUser, triggerNotConnected } from "../../lib/session";
import { Redis } from "@upstash/redis";

export const config = { runtime: "edge" };

const redis = Redis.fromEnv();

export default async function handler(request) {
  try {
    const user = await getConnecterUser(request);
    if (!user) {
      console.log("Not connected");
      return triggerNotConnected();
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { key } = await request.json();
    if (!key) {
      throw new Error("Erreur de chargement de la conversation, rechargez la page");
    }

    const messages = await redis.lrange(key,0,-1);

    return new Response(JSON.stringify(messages ?? []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Message fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
