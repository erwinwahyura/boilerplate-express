if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const cors = require('cors');
const express = require('express');
const normalizePort = require('normalize-port');
const bodyParses = require('body-parser')
const app = express();
const port = normalizePort(process.env.PORT || '3000');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down')
const mongoose = require('mongoose')
const { errorHandler } = require('./middleware')

// mongoose connect client
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.error(err);
  } else if (!err) {
    console.log('Database is connected');
  }
});
mongoose.set('debug', true)

// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 15 // limit each IP to 15 requests per windowMs
});

// app.enable("trust proxy")
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100
})

app.use(limiter)
app.use(speedLimiter)

const routes = require('./routes')
app.use(bodyParses.urlencoded({ limit: '25mb', extended: true }));
app.use(bodyParses.json({ limit: "25mb" }))
app.use(cors());

app.get('/', (req, res) => {
  res.send('Ok')
})

routes(app, express)
app.use(errorHandler)

app.listen(port, () => console.log(`Server: running on port ${port}`))
