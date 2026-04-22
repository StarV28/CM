import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import redisClient from "../../db/connect_Redis.js";
import { cacheRedisServer } from "../../utils/cacheRedisServer.js";
import CoinsModel from "../v1/external/coins/CoinsModel.js";

const clients: Set<WebSocket> = new Set();
//-------------------------------------------------------------------------------------//
export function setupWs(server: http.Server) {
  const wss = new WebSocketServer({ server });

  //-------connect ws-------
  wss.on("connection", (ws: WebSocket) => {
    console.log("🟢 New client connected");
    clients.add(ws);

    ws.on("close", () => {
      clients.delete(ws);
      console.log("🔴 Client disconnected");
    });

    ws.on("message", async (message) => {
      const msg = JSON.parse(message.toString());
      switch (msg.type) {
        case "get-coins": {
          const cacheKey = "coins:snapshots";
          // const cachedCoins = await redisClient.get(cacheKey);
          const cachedCoins = await cacheRedisServer.get(cacheKey);
          if (cachedCoins) {
            ws.send(
              JSON.stringify({ type: "coins:snapshots", data: cachedCoins }),
            );
          } else {
            const data = await CoinsModel.getAllCoins();
            ws.send(JSON.stringify({ type: "coins:snapshots", data }));
          }
          break;
        }
        case "get-exchanges": {
          const cacheKeyEx = "market:exchange";
          const cachedEx = await redisClient.get(cacheKeyEx);
          if (cachedEx) {
            ws.send(
              JSON.stringify({ type: "exchange-update", data: cachedEx }),
            );
          }
          break;
        }

        default:
          console.warn("⚠️ Unknown WS message type:", msg.type);
      }
    });
  });
  //------SetInterval---coins:delta------------
  setInterval(async () => {
    try {
      // const coins = await redisClient.get("coins:delta");
      const coins = await cacheRedisServer.get("coins:delta");
      if (coins) {
        console.log("[Coins] delta redis success");
      }
      const delta = coins || (await CoinsModel.getAllCoins());
      if (!delta) return;

      const payload = JSON.stringify({
        type: "coins:delta",
        data: delta,
      });
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    } catch (err) {
      console.error("❌ Error updating WS data:", (err as Error).message);
    }
  }, 30 * 1000);
  //------SetInterval----coins:snapshot-----------------------------//

  setInterval(async () => {
    try {
      // const coins = await redisClient.get("coins:snapshots");
      const coins = await cacheRedisServer.get("coins:snapshots");
      if (coins) {
        console.log("[Coins] snapshots redis success");
      }
      const snapshots = coins || (await CoinsModel.getAllCoins());
      if (!snapshots) return;
      const payload = JSON.stringify({
        type: "coins:snapshots",
        data: snapshots,
      });
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    } catch (err) {
      console.error("❌ Error updating WS data:", (err as Error).message);
    }
  }, 120 * 1000);

  //---------------------------------------//

  setInterval(async () => {
    try {
      const cacheKeyEx = "market:exchange";
      const dataEx = await redisClient.get(cacheKeyEx);

      for (const client of clients) {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({ type: "exchange-update", data: dataEx }),
          );
        }
      }

      console.log("♻️ WS data broadcast completed");
    } catch (err) {
      console.error("❌ Error updating WS data:", (err as Error).message);
    }
  }, 60 * 1000);
}
