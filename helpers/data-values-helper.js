const request = require('request');
const Promise = require('promise');
const _ = require('lodash');



async function getDataValueFromServer(serverUrl, headers, dataSet, orgUnit, period) {
    const url = `${serverUrl}/api/dataValueSets.json?dataSet=${dataSet}&orgUnit=${orgUnit}&children=true&period=${period}`;
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
                        body = { ...body,
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