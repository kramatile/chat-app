import {checkSession, unauthorizedResponse} from "../lib/session.js";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();


export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }
    const connected = await checkSession(req);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

    const message = req.body;
    console.log("Incoming message:", message);

    if (!message?.key || !message?.text || !message?.sent_time) {
      return res
        .status(400)
        .json({ error: "Erreur d'envoi du message, rechargez la page" });
    }

    await redis.rpush(
      message.key,
      JSON.stringify({
        text: message.text,
        sent_time: message.sent_time,
        sender_name: message.sender_name,
        sender_id: message.sender_id,
      })
    );

    await redis.expire(message.key, 2592000); 

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Message save error:", error);
    return res.status(500).json({ error: error.message });
  }
}
