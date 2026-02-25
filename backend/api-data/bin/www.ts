import app from "../app.js";
import debugLib from "debug";
import http from "http";
import type { AddressInfo } from "net";
import { setupWs } from "../src/ws/setupWS.js";
import getPool from "../db/connect_MySQL.js";

const debug = debugLib("my-express-app:server");

function normalizePort(val: string): number | string | false {
  const portNum = parseInt(val, 10);
  if (isNaN(portNum)) return val;
  if (portNum >= 0) return portNum;
  return false;
}

await getPool();

const port: number | string | false = normalizePort(process.env.PORT || "3001");
app.set("port", port);

const server: http.Server = http.createServer(app);
// server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

//--ws
setupWs(server);
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr: AddressInfo | string | null = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : `port ${addr?.port}`;
  debug(`Listening on ${bind}`);
}
