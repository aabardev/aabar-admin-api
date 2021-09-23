import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import { getAuthorizationUrl, getNewTokens } from "./dbx/dbxHandlers.js";
import { addNewMenuCategory } from "./handlers.js";

dotenv.config();

const payloadConfig = {
  maxBytes: 157286400,
  output: "data",
  parse: true,
  multipart: true,
};

const init = async () => {
  const cors_allowed_origins = process.env.CORS_ALLOWED_ORIGINS.split(",");
  const server = Hapi.server({
    port: process.env.PORT || 8000,
    routes: {
      cors: {
        origin: cors_allowed_origins,
      },
    },
  });

  server.route([
    {
      method: "GET",
      path: "/",
      handler: (req, h) => {
        return "Admin Server Running";
      },
    },
    {
      method: "GET",
      path: "/dbxGetAuthorizationUrl",
      handler: (req, h) => {
        return getAuthorizationUrl();
      },
    },
    {
      method: "POST",
      path: "/dbxGetNewTokens",
      handler: async (req, h) => {
        const res = await getNewTokens(req.payload.authorization_code);
        return res;
      },
    },
    {
      method: "POST",
      path: "/addNewMenuCategory",
      config: {
        handler: async (req, h) => {
          const res = await addNewMenuCategory(req.payload);
          return res;
        },
        payload: payloadConfig,
      },
    },
  ]);

  await server.start();
  console.log("Server running on: %s", server.info.uri);
  console.log("CORS_ALLOWED_ORIGINS:", ...cors_allowed_origins);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
