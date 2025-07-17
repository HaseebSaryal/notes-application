const express = require("express");
const app = express();
const dotenv = require("dotenv");
const router = require("./router/routes");
const connectDb = require("./controllers/connectDb");
const cors = require('cors');

dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json()); 


app.use("/api", router); 

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`PORT is running at http://localhost:${PORT}`);
  });
});
