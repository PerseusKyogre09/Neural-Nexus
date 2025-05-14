import { createClient } from 'redis';
// @ts-ignore: Missing type declarations for @vercel/blob
import { put, getBlob, del } from '@vercel/blob';
import { get } from '@vercel/edge-config';

// Redis Client Initialization
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error, no cap:', err));

// Connect to Redis on initialization
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected, fam! We lit!');
  } catch (error) {
    console.error('Failed to connect to Redis, fr fr:', error);
  }
})();

// Redis Utility Functions
export const setRedisValue = async (key: string, value: string, expiresInSeconds?: number) => {
  try {
    await redisClient.set(key, value);
    if (expiresInSeconds) {
      await redisClient.expire(key, expiresInSeconds);
    }
    console.log(`Set Redis value for key ${key}, straight fire!`);
    return true;
  } catch (error) {
    console.error(`Error setting Redis value for key ${key}, no bueno:`, error);
    return false;
  }
};

export const getRedisValue = async (key: string) => {
  try {
    const value = await redisClient.get(key);
    console.log(`Got Redis value for key ${key}, it's a vibe!`);
    return value;
  } catch (error) {
    console.error(`Error getting Redis value for key ${key}, total L:`, error);
    return null;
  }
};

export const deleteRedisValue = async (key: string) => {
  try {
    await redisClient.del(key);
    console.log(`Deleted Redis value for key ${key}, yeet!`);
    return true;
  } catch (error) {
    console.error(`Error deleting Redis value for key ${key}, big oof:`, error);
    return false;
  }
};

// Blob Storage Utility Functions
export const uploadBlob = async (filename: string, content: string | Buffer, access: 'public' | 'private' = 'public') => {
  try {
    const { url } = await put(filename, content, { access });
    console.log(`Uploaded blob to ${url}, straight flexin'!`);
    return url;
  } catch (error) {
    console.error(`Error uploading blob ${filename}, total buzzkill:`, error);
    throw error;
  }
};

export const getBlobContent = async (url: string) => {
  try {
    const response = await getBlob(url);
    console.log(`Fetched blob content from ${url}, it's a whole mood!`);
    return response;
  } catch (error) {
    console.error(`Error fetching blob content from ${url}, major L:`, error);
    throw error;
  }
};

export const deleteBlob = async (url: string) => {
  try {
    await del(url);
    console.log(`Deleted blob at ${url}, bye felicia!`);
    return true;
  } catch (error) {
    console.error(`Error deleting blob at ${url}, big yikes:`, error);
    throw error;
  }
};

// Edge Config Utility Functions
export const getEdgeConfigValue = async (key: string) => {
  try {
    const value = await get(key);
    console.log(`Got Edge Config value for ${key}, absolute drip!`);
    return value;
  } catch (error) {
    console.error(`Error getting Edge Config value for ${key}, straight up not cool:`, error);
    throw error;
  }
};

// Export the Redis client for direct usage if needed
export { redisClient }; 