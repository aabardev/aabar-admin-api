import Hapi from "@hapi/hapi";
import dotenv from 'dotenv';

dotenv.config();

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
          method: 'GET',
          path: '/',
          handler: () => {
              return 'Admin Server Running'
          }
      }
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
