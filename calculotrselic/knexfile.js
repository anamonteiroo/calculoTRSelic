const { loadEnvConfig } = require('@next/env')

const dev = process.env.NODE_ENV !== 'production'
const { PG_URI } = loadEnvConfig('./', dev).combinedEnv

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite'
  },
  migrations: {
    directory: './knex/migrations',
  },
  seeds: {
    directory: './knex/seeds',
  },
}
