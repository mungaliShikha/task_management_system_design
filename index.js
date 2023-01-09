global.mongoose = require('mongoose');
global.express = require('express');
global.rateLimit = require("express-rate-limit")
require('dotenv').config();

const appError = require("./utils/errorHandlers/errorHandler")
const errorController = require("./utils/errorHandlers/errorController")
const apiRouteLogger = require("./utils/logger/apiRouteLogger")



const managerRoute = require("./managers/manager.route")
const developerRoute = require("./developers/developer.route")




const app = express();
app.use(express.json());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "too many requests, try again later"
})



// app.use('/managers', limiter, apiRouteLogger, managerRoute);
// app.use('/developers', limiter, apiRouteLogger, developerRoute);



mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://task_management_project:NYvDITjmrPvnIMzm@cluster0.gt6t6cy.mongodb.net/task_management", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to database")
    })
    .catch((err) => {
        console.log(err);
    });

    




app.all('*', (req, res, next) => {
    throw new appError(`Requested URL http://localhost:${5000}${req.path} not found!`, 404);

})



app.use(errorController)




app.listen(5000, () => {
    console.log(`listening to port ${5000}`);
});


