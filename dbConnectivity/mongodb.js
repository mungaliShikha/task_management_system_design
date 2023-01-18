const mongoose = require('mongoose')
const logger = require("../utils/logger/logger")
global.Promise = mongoose.Promise;
const config = require('../config/config')
const db_name = `${global.gConfig.database}`;
const user_name = `${global.gConfig.user_name}`;
const password = `${global.gConfig.password}`
const DB_URL = `mongodb+srv://${user_name}:${password}@cluster0.gt6t6cy.mongodb.net/${db_name}`

mongoose.set('useFindAndModify', false);
mongoose.connection.openUri(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })



/******************************** Events of mongoose connection. ******************************************************/
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
     logger.info('success : Mongoose default connection')
});
// if the connection throw an error
mongoose.connection.on('error', (err) => {
     logger.info('error : Mongoose default connection error')
});
// when the connectio is disconnected
mongoose.connection.on('disconnected', () => {
     logger.info('disconnected : Mongoose default connection is disconnected')
})
//if the node process ends,close the mongoose connection

// process.on('SIGINT', () => {
//      mongoose.connection.close(() => {
//           console.log('warning', 'Mongoose default connection disconnected through app termination')
//      });
// });







