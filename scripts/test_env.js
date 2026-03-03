require('dotenv').config({ path: '.env.local' });

console.log('Variables de entorno cargadas:');
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_ENCRYPT:', process.env.DB_ENCRYPT);
console.log('DB_TRUST_SERVER_CERTIFICATE:', process.env.DB_TRUST_SERVER_CERTIFICATE);
