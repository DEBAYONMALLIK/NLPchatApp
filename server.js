const express = require("express");
const natural = require('natural');
const cors = require('cors');
const route=require("route.js")
const app = express();
app.use(cors());
app.use(express.json());



route(app);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
