const { Client } = require('pg');

const client = new Client({
user: 'your-username',
host: 'localhost',
database: 'your-database',
password: 'your-password',
port: 5432,
});

client.connect();

module.exports = client;