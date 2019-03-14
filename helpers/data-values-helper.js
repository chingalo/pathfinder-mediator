const request = require('request');
const Promise = require('promise');
const _ = require('lodash');



async function getDataValueFromServer(serverUrl, headers, dataSets, orgUnit, periods) {
    const dataSetString = dataSets.json('&dataSet=');
    const periodString = periods.json('&period=');
    const orgUnitString = dataSets.json('&orgUnit=');
    const url = `${serverUrl}/api/dataValueSets.json?dataSet=${dataSetString}&orgUnit=${orgUnitString}&children=true&period=${periodString}`;
    return new Promise(resolve => {
        request({
                headers,
                uri: url,
                method: 'GET'
            },
            (error, response, body) => {
                const dataValues = []
                if (!error && response && response.statusCode === 200) {
                    body = JSON.parse(body);
                    if (!body.dataValues) {
                        body = {
                            ...body,
                            dataValues
                        }
                    }
                    resolve(
                        body
                    );
                } else {
                    resolve({
                        dataSet,
                        period,
                        orgUnit,
                        dataValues
                    });
                }
            }
        );
    })
}

async function uploadDataValuesToTheServer(serverUrl, headers, payLoad) {
    const url = `${serverUrl}/api/dataValueSets.json`;
    return new Promise(resolve => {
        request({
                headers,
                uri: url,
                method: 'POST',
                body: JSON.stringify(payLoad)
            },
            (error, response, body) => {
                // console.log(error)
                // console.log(response)
                // console.log(body)
                body = JSON.parse(body);
                const {
                    status
                } = body;
                const {
                    importCount
                } = body;
                const {
                    conflicts
                } = body;
                resolve({
                    conflicts,
                    importCount,
                    status
                });
            }
        );
    });
}


module.exports = {
    getDataValueFromServer,
    uploadDataValuesToTheServer
}