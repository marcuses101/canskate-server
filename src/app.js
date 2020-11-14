require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV,} = require("./config");
const logger = require("./logger");
const app = express();
const skaterRouter = require('./skater/skater-routes');
const ElementRouter = require('./element/element-routes');
const ElementLogRouter = require('./element-log/element-log-routes');

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";


app.use(express.json())
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Routes
app.use('/api/skater',skaterRouter);
app.use('/api/element',ElementRouter);
app.use('/api/log', ElementLogRouter);

app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    logger.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
