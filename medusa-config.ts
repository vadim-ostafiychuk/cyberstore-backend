import { loadEnv, defineConfig } from "@medusajs/framework/utils";
import { cleanEnv, str, bool, num } from "envalid";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

let env;

if (process.env.NODE_ENV !== "production") {
  env = cleanEnv(process.env, {
    SMTP_HOST: str(),
    SMTP_PORT: num(),
    SMTP_SECURE: bool(),
    SMTP_USER: str(),
    SMTP_PASS: str(),
    NOVA_POSHTA_API_KEY: str(),
  });
}

const plugins = [];

module.exports = defineConfig({
  plugins,
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "./src/modules/nova-poshta",
      options: {
        apiKey: env?.NOVA_POSHTA_API_KEY || process.env.NOVA_POSHTA_API_KEY,
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/COD-payment",
            id: "COD-payment",
            options: {},
          },
          {
            resolve: "./src/modules/card-payment",
            id: "CardPayment",
            options: {},
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
          {
            resolve: "./src/modules/email-notification",
            id: "email-notification",
            options: {
              channels: ["email"],
              host: env?.SMTP_HOST || process.env.SMTP_HOST,
              port: env?.SMTP_PORT || process.env.SMTP_PORT,
              secure: env?.SMTP_SECURE || process.env.SMTP_SECURE,
              user: env?.SMTP_USER || process.env.SMTP_USER,
              pass: env?.SMTP_PASS || process.env.SMTP_PASS,
            },
          },
        ],
      },
    },
  ],
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
});
