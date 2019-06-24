const {
    sourceServer,
    destinationServer
} = require('./server-config');

const {
    dataSetConfig
} = require('./data-set-config');

module.exports = {
    sourceConfig: sourceServer,
    destinationConfig: destinationServer,
    dataSetConfig
}