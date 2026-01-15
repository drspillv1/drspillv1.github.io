import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ff533cce/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint - store email signups
app.post("/make-server-ff533cce/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, name } = body;

    if (!email || !name) {
      return c.json({ error: "Name and email are required" }, 400);
    }

    // Create a unique key for each signup using timestamp
    const timestamp = Date.now();
    const signupKey = `signup:${timestamp}:${email}`;

    // Store the signup data
    await kv.set(signupKey, {
      name,
      email,
      timestamp,
      date: new Date().toISOString(),
    });

    console.log(`New signup stored: ${email} - ${name}`);

    return c.json({
      success: true,
      message: "Successfully signed up!",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return c.json({ error: "Failed to process signup" }, 500);
  }
});

// Get all signups (optional - for admin purposes)
app.get("/make-server-ff533cce/signups", async (c) => {
  try {
    const signups = await kv.getByPrefix("signup:");
    return c.json({
      success: true,
      count: signups.length,
      signups,
    });
  } catch (error) {
    console.error("Error fetching signups:", error);
    return c.json({ error: "Failed to fetch signups" }, 500);
  }
});

Deno.serve(app.fetch);