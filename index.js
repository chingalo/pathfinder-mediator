const _ = require('lodash');

const {
    getDataValueFromServer,
    uploadDataValuesToTheServer,
    getDataElementsMapper

} = require('./helpers/index')
const dataSet = 'TtKTj3UuSFz';
const organisationUnitId = "EO3Ps3ny0Nr";
const periods = ["2018"];
const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer('admin:district').toString('base64')
};
const serverUrl = 'https://dhis2tz.pathfinder.org';
const dataElementMapper = getDataElementsMapper();
startApp();

async function startApp() {
    for (const period of periods) {
        const dataElements = Object.keys(dataElementMapper);
        const response = await getDataValueFromServer(serverUrl, headers, dataSet, organisationUnitId, period);
        const {
            dataValues
        } = response;
        const newDataValues = getDataValuesObjects(dataValues, dataElements, dataElementMapper);
        const payload = { ...{},
            dataValues: newDataValues
        }
        const {
            importCount,
            status,
            conflicts
        } = await uploadDataValuesToTheServer(serverUrl, headers, payload);
        console.log(JSON.stringify({
            status,
            importCount,
            conflicts
        }));
    }
}

function getDataValuesObjects(responseDataValues, dataElements, dataElementMapper) {
    return _.flatMapDeep(_.map(responseDataValues, (responseDataValue) => {
        const dataValues = []
        if (_.indexOf(dataElements, responseDataValue.dataElement) > -1) {
            const {
                value
            } = responseDataValue;
            responseDataValue = { ...responseDataValue,
                value: ""
            };
            dataValues.push(responseDataValue);
            const dataElementId = dataElementMapper[responseDataValue.dataElement];
            dataValues.push({ ...responseDataValue,
                value,
                dataElement: dataElementId
            });
        } else {
            dataValues.push(responseDataValue);
        }
        return dataValues;
    }));
}