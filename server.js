const express = require("express");
const config = require("./config/config.json");
const db = require("./dbConnectivity/mongodb");
const index = require("./routes/indexRoute");
const cors = require("cors");
const app = express();
app.use(cors());
const axios = require('axios');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const appError = require("./utils/errorHandlers/errorHandler");
const errorController = require("./utils/errorHandlers/errorController");

app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(express.json({ limit: "1000mb" }));

app.use("/api", index);


app.all("*", (req, res, next) => {
  throw new appError(
    `Requested URL http://localhost:${5000}${req.path} not found!`,
    404
  );
});

app.use(errorController);



app.listen(global.gConfig.node_port, function () {
  console.log("Server is listening on", global.gConfig.node_port);
});



