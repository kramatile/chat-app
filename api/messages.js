import {checkSession, unauthorizedResponse} from "../lib/session.js";
import { Redis } from "@upstash/redis";
import PushNotifications from "@pusher/push-notifications-server";
const redis = Redis.fromEnv();

const beamsClient = new PushNotifications({
  instanceId: process.env.VITE_PUSHER_INSTANCE_ID,
  secretKey: process.env.VITE_PUSHER_SECRET_KEY, 
});

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
    try {
    if (message.type === "room") {
      await beamsClient.publishToInterests([message.key], { 
        web: { notification: {
          title: `New message from ${message.sender_name}`,
          body: message.text,
          ico: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
          data:{
                    type: "NEW_PUSH_MESSAGE",
                    // NOTE: Adding all message data to be sent to the Service Worker
                    message: {
                        text: message.text,
                        sender_name: message.sender_name,
                        sender_id: message.sender_id,
                        sent_time: message.sent_time,
                        key: message.key,
                        type: message.type
                    } 
                  }
        }
       },
      });
    } else {
      if (typeof message.sent_to_ext_id === 'string' && message.sent_to_ext_id.length > 0) {
          await beamsClient.publishToUsers([message.sent_to_ext_id], {
                  web: { notification: {
                    title: `New private message from ${message.sender_name}`,
                    body: message.text,
                    ico: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
                  }, 
                  data:{
                    type: "NEW_PUSH_MESSAGE",
                    // NOTE: Adding all message data to be sent to the Service Worker
                    message: {
                        text: message.text,
                        sender_name: message.sender_name,
                        sender_id: message.sender_id,
                        sent_time: message.sent_time,
                        key: message.key,
                        type: message.type
                    } 
                  }
                },
                });
              } else {
                console.warn(`Skipped push notification: Invalid message.sent_to_ext_id (${message.sent_to_ext_id}) for user chat key: ${message.key}`);
                // You might add logging here to figure out *why* it was missing
              }   
         }
  } catch (err) {
    console.error("Failed to send push notification:", err);
  }
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Message save error:", error);
    return res.status(500).json({ error: error.message });
  }
}
