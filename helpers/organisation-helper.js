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
                // console.log(response)
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

async function getFacilityByOuAndDataSet(serverUrl, headers, dataSetId, ou) {
    const url = `${serverUrl}/api/organisationUnits.json?fields=id&filter=level:eq:4&filter=path:ilike:${ou}&filter=dataSets.id:in:[${dataSetId}]&paging=false`;
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
                    console.log(body)
                    resolve([]);
                }
            }
        );
    })

}

module.exports = {
    getOrganisationUnitsByLevel,
    getOrganisationUnitsByDataSetId,
    getFacilityByOuAndDataSet
}