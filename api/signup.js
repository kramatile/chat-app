import { db } from "@vercel/postgres";
import { Redis } from "@upstash/redis";
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
  runtime: "edge",
};

const redis = Redis.fromEnv();

export default async function handler(request) {
  try {
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const hash = await crypto.subtle.digest(
      "SHA-256",
      stringToArrayBuffer(username + password)
    );
    const hashed64 = arrayBufferToBase64(hash);

    const client = await db.connect();

    const userCheck = await client.sql`SELECT * FROM users WHERE username = ${username}`;
    if (userCheck.rowCount > 0) {
      return new Response(
        JSON.stringify({ code: "USERNAME_TAKEN", message: "Username already in use" }),
        { status: 409, headers: { "content-type": "application/json" } }
      );
    }

    const emailCheck = await client.sql`SELECT * FROM users WHERE email = ${email}`;
    if (emailCheck.rowCount > 0) {
      return new Response(
        JSON.stringify({ code: "EMAIL_TAKEN", message: "Email already in use" }),
        { status: 409, headers: { "content-type": "application/json" } }
      );
    }

    const externalId = crypto.randomUUID();
    await client.sql`
      INSERT INTO users (username, password, email, created_on, external_id, last_login)
      VALUES (${username}, ${hashed64}, ${email}, NOW(), ${externalId}, NOW())
    `;

    const idRes = await client.sql`
      SELECT user_id, external_id FROM users WHERE username = ${username}
    `;
    const userRow = idRes.rows[0];

    const token = crypto.randomUUID();
    const user = {
      id: userRow.user_id,
      username,
      email,
      externalId: userRow.external_id,
    };

    await redis.set(token, user, { ex: 3600 });
    await redis.hset("users", { [user.id]: user });

    return new Response(
      JSON.stringify({
        token,
        username,
        externalId: user.externalId,
        id: user.id,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error", error }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
