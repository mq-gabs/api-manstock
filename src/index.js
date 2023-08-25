require('dotenv/config');
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const database = require('./database/sqlite');
const routes = require('./routes');
const errorHandling = require('./utils/error-handling');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use(errorHandling);

database();

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));