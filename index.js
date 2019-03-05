const _ = require('lodash');

const {
    getDataValueFromServer,
    uploadDataValuesToTheServer,
    getLastMonthsIsoPeriod,
    getOrganisationUnitsByLevel

} = require('./helpers/index');

const sourceHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer('admin:district').toString('base64')
};
const destinationHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer('api_user:API_USER2019a').toString('base64')
};
const souceServerUrl = 'https://dhis2tz.pathfinder.org';
const destinationServerUrl = 'https://dhis2tz.pathfinder.org';
const numberOfPreviousMonth = 1;
const dataSets = ["kSaoJVXNxZE", "TfoI3vTGv1f", "GzvLb3XVZbR", "cap79mdf6Co", "rm3y3VHPiFD", "zeEp4Xu2GOm"];
const organisationUnitLevel = 4;


startApp();

async function startApp() {
    const periods = getLastMonthsIsoPeriod(numberOfPreviousMonth);
    const organisationUnits = await getOrganisationUnitsByLevel(destinationServerUrl, destinationHeaders, organisationUnitLevel);
    for (const organisationUnit of organisationUnits) {
        if (organisationUnit && organisationUnit.children && organisationUnit.children.length === 0) {
            const organisationUnitId = organisationUnit.id;
            for (const dataSet of dataSets) {
                for (const period of periods) {
                    console.log(`Discovering data value for dataset ${dataSet} period ${period} and organisationUnit ${organisationUnitId}`)
                    const response = await getDataValueFromServer(souceServerUrl, sourceHeaders, dataSet, organisationUnitId, period);
                    const {
                        dataValues
                    } = response;
                    const payload = {
                        ...{},
                        dataValues
                    }
                    const dataValueCount = dataValues.length;
                    if (dataValueCount > 0) {
                        console.log(`Uploading data value for dataset ${dataValueCount} period ${period} and organisationUnit ${organisationUnitId}`);
                        const {
                            importCount,
                            status,
                            conflicts
                        } = await uploadDataValuesToTheServer(destinationServerUrl, destinationHeaders, payload);
                        console.log(JSON.stringify({
                            status,
                            importCount,
                            conflicts
                        }));
                    }

                }
            }
        }
    }
}