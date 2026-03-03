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

async function analyzeDatabase() {
  try {
    console.log('Conectando a la base de datos...');
    await sql.connect(config);
    console.log('✓ Conexión exitosa!\n');

    // Obtener lista de tablas
    console.log('=== TABLAS EN LA BASE DE DATOS ===\n');
    const tablesResult = await sql.query`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `;

    const tables = tablesResult.recordset;
    console.log(`Se encontraron ${tables.length} tablas:\n`);
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.TABLE_NAME}`);
    });

    console.log('\n\n=== ESTRUCTURA DETALLADA DE CADA TABLA ===\n');

    // Para cada tabla, obtener estructura
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`\n${'='.repeat(80)}`);
      console.log(`TABLA: ${tableName}`);
      console.log('='.repeat(80));

      // Obtener columnas
      const columnsResult = await sql.query`
        SELECT
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          IS_NULLABLE,
          COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = ${tableName}
        ORDER BY ORDINAL_POSITION
      `;

      console.log('\nCOLUMNAS:');
      console.log('-'.repeat(80));
      columnsResult.recordset.forEach(col => {
        const length = col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : '';
        const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.COLUMN_DEFAULT ? ` DEFAULT ${col.COLUMN_DEFAULT}` : '';
        console.log(`  ${col.COLUMN_NAME.padEnd(30)} ${(col.DATA_TYPE + length).padEnd(20)} ${nullable}${defaultVal}`);
      });

      // Obtener primary keys
      const pkResult = await sql.query`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + CONSTRAINT_NAME), 'IsPrimaryKey') = 1
        AND TABLE_NAME = ${tableName}
      `;

      if (pkResult.recordset.length > 0) {
        console.log('\nPRIMARY KEY:');
        pkResult.recordset.forEach(pk => {
          console.log(`  - ${pk.COLUMN_NAME}`);
        });
      }

      // Obtener foreign keys
      const fkResult = await sql.query`
        SELECT
          fk.name AS FK_NAME,
          COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS FK_COLUMN,
          OBJECT_NAME(fkc.referenced_object_id) AS REFERENCED_TABLE,
          COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS REFERENCED_COLUMN
        FROM sys.foreign_keys AS fk
        INNER JOIN sys.foreign_key_columns AS fkc ON fk.object_id = fkc.constraint_object_id
        WHERE OBJECT_NAME(fk.parent_object_id) = ${tableName}
      `;

      if (fkResult.recordset.length > 0) {
        console.log('\nFOREIGN KEYS:');
        fkResult.recordset.forEach(fk => {
          console.log(`  - ${fk.FK_COLUMN} -> ${fk.REFERENCED_TABLE}(${fk.REFERENCED_COLUMN})`);
        });
      }

      // Obtener datos de ejemplo (primeros 3 registros)
      try {
        const sampleResult = await sql.query`
          SELECT TOP 3 * FROM ${sql.Table(tableName)}
        `;

        if (sampleResult.recordset.length > 0) {
          console.log('\nDATA DE EJEMPLO (primeros 3 registros):');
          console.log(JSON.stringify(sampleResult.recordset, null, 2));
        } else {
          console.log('\nDATA DE EJEMPLO: (tabla vacía)');
        }
      } catch (err) {
        console.log('\nDATA DE EJEMPLO: Error al obtener datos -', err.message);
      }
    }

    console.log('\n\n' + '='.repeat(80));
    console.log('ANÁLISIS COMPLETADO');
    console.log('='.repeat(80));

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Detalles:', err);
  } finally {
    await sql.close();
  }
}

analyzeDatabase();
