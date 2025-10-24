import { getConnecterUser, triggerNotConnected } from "../lib/session";
import { Redis } from "@upstash/redis";

export const config = {
  runtime: "edge",
};

const redis = Redis.fromEnv();

export default async function handler(request) {
  try {
    const headers = new Headers(request.headers);

    const user = await getConnecterUser(request);
    if (!user) {
      console.log("Not connected");
      return triggerNotConnected();
    }

    const message = await request.json();
    console.log("Incoming message:", message);

    if (!message?.key) {
      throw new Error("Erreur de chargement de la conversation, rechargez la page");
    }

    const messages = await redis.get(message.key);

    if (!messages) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(messages), {
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
