import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const clients: Set<WebSocket> = new Set();

//-------------------------------------------------------------------------------------//
export function setupWs(server: http.Server) {
  const wss = new WebSocketServer({ server });
}
