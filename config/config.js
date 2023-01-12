const _ = require('lodash');
const config = require('./config.json');
const fields = require("./fields.json")
const defaultConfig = config.development
const defaultFields = fields.env
const environment = process.env.Node_ENV || 'development';
// const environment= process.env.Node_ENV || 'staging'; 
const environmentConfig = config[environment]
const finalConfig = _.merge(defaultConfig, environmentConfig)
global.gConfig = finalConfig;
global.gFields = defaultFields;

