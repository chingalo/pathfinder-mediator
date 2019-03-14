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
const ouChunkSize = (process.argv[2]) ? 25 : 50;
const periodsData = _.chunk(getLastMonthsIsoPeriod(numberOfPreviousMonth).reverse(), 3);
const dataSets = ["TfoI3vTGv1f", "kSaoJVXNxZE", "GzvLb3XVZbR", "cap79mdf6Co", "rm3y3VHPiFD", "zeEp4Xu2GOm"];

startApp();

async function startApp() {
    console.log("Discovering organisation units");
    const organisationUnits = await getOrganisationUnitsByDataSetId(destinationServerUrl, destinationHeaders, dataSets);
    if (organisationUnits.length > 0) {
        for (const periods of periodsData) {
            const organisationUnitsArray = _.chunk(_.map(organisationUnits, organisationUnit => organisationUnit.id), ouChunkSize);
            for (const organisationUnitArray of organisationUnitsArray) {
                console.log("Loading data values")
                const response = await getDataValueFromServer(souceServerUrl, sourceHeaders, dataSets, organisationUnitArray, periods);
                const {
                    dataValues
                } = response;
                const dataValuesData = _.chunk(dataValues, 500);
                for (const data of dataValuesData) {
                    const payload = {
                        ...{},
                        dataValues: data
                    };
                    const dataValueCount = data.length;
                    if (dataValueCount > 0) {
                        console.log(`Uploading data value ${dataValueCount}`);
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
    } else {
        console.log(`There is no ou assigned for datasets ${dataSets.join(',')}`)
    }

}