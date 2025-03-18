const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const indexRouter = require("./routes/index.js");
const fetchReqRouter = require("./routes/fetchreq.js");

app.use(indexRouter);
app.use("/domainrequest", fetchReqRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
