import { trCoinsRedisSnapshots } from "../../domain/coins/services/build_coins/helper_snapshots.redis.js";
import { trCoinsRedisDelta } from "../../domain/coins/services/build_coins/helper_delta.redis.js";

//-------------------------------------------------------------------------------------//

export default class CollectRedis {
  //---------------------------------------//
  static async deltaRedis(): Promise<void> {
    await trCoinsRedisDelta();
  }
  //---------------------------------------//
  static async snapshotRedis(): Promise<void> {
    await trCoinsRedisSnapshots();
  }
}
