import sql from 'mssql'

// Asegurar que la contraseña se lee correctamente (remover comillas si existen)
const db_password = process.env.DB_PASSWORD || ''
const clean_password = db_password.replace(/^["']|["']$/g, '')

const config: sql.config = {
  server: process.env.DB_SERVER || '',
  user: process.env.DB_USER || '',
  password: clean_password,
  database: process.env.DB_DATABASE || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool | null = null

export async function get_database_pool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}

export async function close_database_pool(): Promise<void> {
  if (pool) {
    await pool.close()
    pool = null
  }
}

export { sql }
