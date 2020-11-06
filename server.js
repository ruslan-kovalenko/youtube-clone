const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
const videoRoutes = require('./api/routes/video');

app.use(bodyParser.json());
app.use('/video', videoRoutes);

const db = require("./config/key").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err));

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

app.use('/uploads', express.static('uploads'));

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
