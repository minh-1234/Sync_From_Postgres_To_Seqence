const { Sequelize } = require("sequelize")
var fs = require('fs');
const sequelize = new Sequelize("project_intern", "guest", "12345", {
  host: "localhost",
  dialect: 'postgres',
  port: 5432
})

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const close = () => {
  sequelize.close()
}
const content = (object) => {
  return `module.exports = ` + JSON.stringify(object, null, 2);
}

const map = {
  'integer': "DataTypes.INTEGER",
  'boolean': "DataTypes.BOOLEAN",
  'character varying': "DataTypes.STRING",
  'date': "DataTypes.DATE",
  'text': "DataTypes.TEXT"
}
const getAllFunctionInDB = async (schema_name) => {
  const results = await sequelize.query(`SELECT proname AS function_name,
       pg_get_functiondef(p.oid) AS function_definition,
       n.nspname AS schema_name,
       pg_catalog.pg_get_function_arguments(p.oid) AS arguments,
       pg_catalog.format_type(p.prorettype, NULL) AS return_type
       FROM pg_proc p
       LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
       WHERE n.nspname NOT IN ('pg_catalog', 'information_schema') AND n.nspname = ?
       ORDER BY schema_name, function_name;`, {
    replacements: [schema_name],
    raw: true // Use replacements to safely pass parameters
  })
  close()
  console.log(results[0])
  return results[0]
}
const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const syncFuntionFromPosgresToModel = async (result, object) => {
  result.forEach((column) => {
    const {
      function_name,
      arguments,
      return_type,
      function_definition,
    } = column;
    const input = arguments;

    // Sử dụng Regular Expression để tìm các kiểu dữ liệu
    const regex = /\b(character varying|integer|boolean|date|text)\b/g;

    // Trích xuất các kiểu dữ liệu
    const types = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
      types.push(map[match[0]]);
    }

    // Kết quả dạng tuple
    const tuple = [...types];
    const placeholders = tuple.map(() => '?').join(',');
    object[function_name] = {
      arguments: tuple,
      return_type: return_type,
      call_function: `${function_name}(${placeholders})`
    };
  })
  return object
}
rl.question("Enter database and table: ", async (input) => {
  const [schema_name] = input.split(' '); // Split input by space

  await connection();
  const result = await getAllFunctionInDB(input = 'public')

  const object = await syncFuntionFromPosgresToModel(result, {})
  // fs.writeFileSync('../../src/test3.js', content(object), "utf8");
  fs.writeFileSync('test3.js', content(object), "utf8");
  console.log(object)
  rl.close();
});