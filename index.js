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
    console.log("Discovering organisation units");
    const organisationUnits = await getOrganisationUnitsByDataSetId(destinationServerUrl, destinationHeaders, dataSets);
    const size = parseInt(organisationUnits.length / 4);
    const organisationUnitsArray = _.chunk(organisationUnits, size);
    for (const organisationUnitArray of organisationUnitsArray) {
        console.log("Loading data values")
        const response = await getDataValueFromServer(souceServerUrl, sourceHeaders, dataSets, organisationUnitArray, periods);
        const {
            dataValues
        } = response;
        console.log(dataValues.length);
    }

    // [organisationUnitsArray[0]].map(organisationUnitArray => {
    //     console.log(`Discovering data value for datasets for ` + organisationUnitArray.length + ` organisationUnits`);

    // });




    // for (const dataSet of dataSets) {


    //     console.log(`Found ${organisationUnits.length} organisation units assigned for data set ${dataSet}`);
    //     for (const organisationUnit of organisationUnits) {
    //         if (organisationUnit && organisationUnit.children && organisationUnit.children.length === 0) {
    //             const organisationUnitId = organisationUnit.id;
    //             for (const period of periods) {

    //                 const payload = {
    //                     ...{},
    //                     dataValues
    //                 }
    //                 const dataValueCount = dataValues.length;
    //                 if (dataValueCount > 0) {
    //                     console.log(`Uploading data value ${dataValueCount} for dataset ${dataSet} period ${period} and organisationUnit ${organisationUnitId}`);
    //                     const {
    //                         importCount,
    //                         status,
    //                         conflicts
    //                     } = await uploadDataValuesToTheServer(destinationServerUrl, destinationHeaders, payload);
    //                     console.log(JSON.stringify({
    //                         status,
    //                         importCount,
    //                         conflicts
    //                     }));
    //                 }
    //             }
    //         }
    //     }
    // }


}