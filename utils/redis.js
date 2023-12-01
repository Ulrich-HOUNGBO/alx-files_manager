import * as redis from 'redis'
import { promisify } from 'util'


class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getClient = promisify(this.client.get).bind(this.client);
    this.client.on('error', (err) => console.log(`Redis client not connected to the server: ${error.message}`));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, expirationInSecond) {
    await this.client.setex(key, expirationInSecond, value);
  }
}

export default new RedisClient();
