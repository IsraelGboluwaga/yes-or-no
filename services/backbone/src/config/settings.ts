import { JWT_SECRET } from '../api/lib/constants'

interface IMongo {
  db: string
  host?: string
  port: number | string
  query_limit: number
  username?: string
  password?: string
}

export const config = {
  mongodb: {
    db: process.env.DB_NAME || 'yes-or-no-local',
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || 27017,
    query_limit: 100,
  } as IMongo,
  jwtSecret: JWT_SECRET || 'capri-s0on3',
  maxTimeBeforeExpiry: 2 * 3600,
}
