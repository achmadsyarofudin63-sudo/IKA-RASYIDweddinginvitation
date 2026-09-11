import Redis from 'ioredis'

// Pakai variabel REDIS_URL yang otomatis dibuat oleh
// integrasi Redis Marketplace di Vercel (bukan KV_REST_API_URL lama).
let redis

export function getRedis() {
  if (!redis) {
    const url = process.env.REDIS_URL
    if (!url) {
      throw new Error('REDIS_URL belum diset di environment variable Vercel.')
    }
    redis = new Redis(url)
  }
  return redis
}
