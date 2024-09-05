"use strict";
// This is a singleton of redis client.

const redis = require("redis");

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.cacheExpireTime = 60 * 60; // In seconds.
    }

    getClient() {
        return this.client;
    }

    getValue(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    }

    setValue(key, value, cacheExpireTime) {
        cacheExpireTime = cacheExpireTime || this.cacheExpireTime;

        return new Promise((resolve, reject) =>  {
            this.client.setex(key, cacheExpireTime, value, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    }

    deleteKey(key) {
        return new Promise((resolve, reject) =>  {
            this.client.del(key, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    }

    refreshKey(key, expirationTime) {
        return new Promise((resolve, reject) => {
            this.client.expire(key, expirationTime, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    }
    scanKeys(pattern) {
        return new Promise((resolve, reject) => {
            let cursor = '0';
            let keys = [];

            const scan = () => {
                this.client.scan(cursor, 'MATCH', pattern, (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    cursor = res[0];
                    keys = keys.concat(res[1]);

                    if (cursor === '0') {
                        resolve(keys);
                    } else {
                        scan();
                    }
                });
            };

            scan();
        });
    }
}

module.exports = { redisClient: new RedisClient() };