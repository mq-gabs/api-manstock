const config = require("../../../knexfile");
const knex = require("knex");

const msgs = {
  dev1: "Using Sqlite",
  dev2: "Using Mysql",
};

console.log(`*** ${msgs[process.env.NODE_ENV]} ***`);

const connection = knex(config[process.env.NODE_ENV]);

module.exports = connection;
