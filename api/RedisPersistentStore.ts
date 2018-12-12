
import * as Redis from 'redis';

export class RedisPersistenceStore {

	constructor(readonly _redis: Redis.RedisClient) {
	}

	get(name: string): Promise<string> {
		return this._redis.getAsync(name)
	}

	set(name: string, value: string): Promise<boolean> {
		return this._redis.setAsync(name, value)
	}

}
