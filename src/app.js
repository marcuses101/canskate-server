require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV, CLIENT_ORIGIN, TOKEN_SECRET} = require("./config");
const logger = require("./logger");
const app = express();
const UserRouter = require('./user/user-routes')
const skaterRouter = require('./skater/skater-routes');
const ElementRouter = require('./element/element-routes');
const ElementLogRouter = require('./element-log/element-log-routes');
const GroupRouter = require('./group/group-routes');
const SessionRouter = require("./session/session-routes");
const ClubRouter = require('./club/club-routes');
const skaterClubRouter = require('./skater-club/skater-club-routes');
const skaterSessionRouter = require('./skater-session/skater-session-routes');
const skaterGroupRouter = require('./skater-group/skater-group-routes')
const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

app.use(express.json())
app.use(morgan(morganOption));
app.use(helmet());
// app.use(cors({
//   origin: CLIENT_ORIGIN
// }));
app.use(cors());

// limit request to frontend.

// app.use((req,res,next)=>{
//   console.log(req.get('Referer'));
//   if (req.get('Referer') !== 'http://localhost:3001/') return res.status(400).send('error')
//   next();
// })

app.get("/", (req, res) => {
  res.send("Hello, world!");
});




// Routes
app.use('/api/user', UserRouter)
app.use('/api/skater',skaterRouter);
app.use('/api/group',GroupRouter);
app.use('/api/session',SessionRouter);
app.use('/api/club',ClubRouter)
app.use('/api/element',ElementRouter);
app.use('/api/log', ElementLogRouter);
app.use('/api/skater-club',skaterClubRouter);
app.use('/api/skater-session',skaterSessionRouter);
app.use('/api/skater-group',skaterGroupRouter)

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  let response;
  logger.log(error);
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
