const express = require("express");
const config = require("./config/config.json");
const db = require("./dbConnectivity/mongodb");
const index = require("./routes/indexRoute");
// const morgan = require('morgan');
const app = express();
const cors = require("cors");
app.use(cors());
const appError = require("./utils/errorHandlers/errorHandler");
const errorController = require("./utils/errorHandlers/errorController");
const apiLogger = require("./utils/logger/apiRouteLogger");
// const basicAuth = require('express-basic-auth');

app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(express.json({ limit: "1000mb" }));

// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

// app.use(morgan("dev"));
app.use("/api", apiLogger,index);

// var swaggerDefinition = {
//   info: {
//     title: "task_management_system_designe",
//     version: "2.0.0",
//     description: "task_management_system_design API DOCS",
//   },
//   host: `${global.gConfig.swaggerURL}`,
//   basePath: "/",
// };

// var options = {
//   swaggerDefinition: swaggerDefinition,
//   apis: ["./routes/*/*.js"],
// };

// var swaggerSpec = swaggerJSDoc(options);

// app.get("/swagger.json", function (req, res) {
//   res.setHeader("Content-Type", "application/json");
//   res.send(swaggerSpec);
// });

// // initialize swagger-jsdoc
// // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use(
//   "/api-docs",
//   basicAuth({
//     users: { "no-subhra": "Antino@1" },
//     challenge: true,
//   }),
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerJSDoc(options))
// );

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
