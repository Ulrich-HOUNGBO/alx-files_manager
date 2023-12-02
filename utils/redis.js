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

  async set(key, value, duration) {
    await this.client.set(key, duration, value);
  }


  async del (key) {
    await this.client.del(key);
    return true;
  }
}



const redisClient = new RedisClient();
export default redisClient;
