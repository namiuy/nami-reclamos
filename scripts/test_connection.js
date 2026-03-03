const sql = require('mssql');

const config = {
  server: '179.27.97.70',
  user: 'nasys',
  password: '#sqlAmor0808!',
  database: 'si_rec',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function testConnection() {
  console.log('Intentando conectar con la configuración:');
  console.log('Server:', config.server);
  console.log('User:', config.user);
  console.log('Database:', config.database);
  console.log('Port:', config.port);
  console.log('Encrypt:', config.options.encrypt);
  console.log('TrustServerCertificate:', config.options.trustServerCertificate);
  console.log('');

  try {
    console.log('Conectando...');
    const pool = await sql.connect(config);
    console.log('✓ Conexión exitosa!');

    const result = await pool.request().query('SELECT TOP 1 ReclamoId FROM Reclamo');
    console.log('✓ Query ejecutada correctamente');
    console.log('Resultado:', result.recordset);

    await pool.close();
    console.log('✓ Conexión cerrada correctamente');
  } catch (err) {
    console.error('❌ Error de conexión:');
    console.error('Código:', err.code);
    console.error('Mensaje:', err.message);
    console.error('');
    console.error('Detalles completos:', err);
  }
}

testConnection();
