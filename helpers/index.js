const {
    getDataValueFromServer,
    uploadDataValuesToTheServer
} = require('./data-values-helper');

const {
    getDataElementsMapper
} = require('./data-element');

module.exports = {
    getDataElementsMapper,
    getDataValueFromServer,
    uploadDataValuesToTheServer
}