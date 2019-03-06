const _ = require('lodash');

const {
    getDataValueFromServer,
    uploadDataValuesToTheServer,
    getLastMonthsIsoPeriod,
    getOrganisationUnitsByDataSetId

} = require('./helpers/index');

const sourceHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer('maintenance:Syst3mM@1nt3n@nc3').toString('base64')
};
const destinationHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer('api_user:API_USER2019a').toString('base64')
};
const souceServerUrl = 'https://dhis.moh.go.tz';
const destinationServerUrl = 'https://dhis2tz.pathfinder.org';
const numberOfPreviousMonth = (process.argv[2]) ? process.argv[2] : 3;
const dataSets = ["TfoI3vTGv1f", "kSaoJVXNxZE", "GzvLb3XVZbR", "cap79mdf6Co", "rm3y3VHPiFD", "zeEp4Xu2GOm"];

startApp();

async function startApp() {
    const periods = getLastMonthsIsoPeriod(numberOfPreviousMonth).reverse();
    for (const dataSet of dataSets) {
        console.log("Discovering organisation units");
        const organisationUnits = await getOrganisationUnitsByDataSetId(destinationServerUrl, destinationHeaders, [dataSet]);
        console.log(`Found ${organisationUnits.length} organisation units assigned for data set ${dataSet}`);
        for (const organisationUnit of organisationUnits) {
            if (organisationUnit && organisationUnit.children && organisationUnit.children.length === 0) {
                const organisationUnitId = organisationUnit.id;
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
                        console.log(`Uploading data value ${dataValueCount} for dataset ${dataSet} period ${period} and organisationUnit ${organisationUnitId}`);
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