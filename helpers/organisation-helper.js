const request = require('request');
const Promise = require('promise');

async function getOrganisationUnitsByLevel(serverUrl, headers, level) {
    const url = `${serverUrl}/api/organisationUnits.json?fields=id,children[id]&filter=level:eq:${level}&paging=false`;
    return new Promise(resolve => {
        request({
                headers,
                uri: url,
                method: 'GET'
            },
            (error, response, body) => {
                if (!error && response && response.statusCode === 200) {
                    body = JSON.parse(body);
                    const {
                        organisationUnits
                    } = body;
                    resolve(
                        organisationUnits
                    );
                } else {
                    resolve([]);
                }
            }
        );
    })
}

async function getOrganisationUnitsByDataSetId(serverUrl, headers, dataSetIds) {
    const dataSetIdString = dataSetIds.join(',');
    const url = `${serverUrl}/api/organisationUnits.json?fields=id,children[id]&filter=dataSets.id:in:[${dataSetIdString}]&paging=false`;
    return new Promise(resolve => {
        request({
                headers,
                uri: url,
                method: 'GET'
            },
            (error, response, body) => {
                if (!error && response && response.statusCode === 200) {
                    body = JSON.parse(body);
                    const {
                        organisationUnits
                    } = body;
                    resolve(
                        organisationUnits
                    );
                } else {
                    resolve([]);
                }
            }
        );
    })
}

module.exports = {
    getOrganisationUnitsByLevel,
    getOrganisationUnitsByDataSetId
}