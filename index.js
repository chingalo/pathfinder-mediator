const _ = require('lodash');

const {
    getDataValueFromServer,
    uploadDataValuesToTheServer,
    getLastMonthsIsoPeriod

} = require('./helpers/index');

const sourceHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer('admin:district').toString('base64')
};
const destinationHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer('admin:district').toString('base64')
};
const souceServerUrl = 'https://dhis2tz.pathfinder.org';
const destinationServerUrl = 'https://dhis2tz.pathfinder.org';
const numberOfPreviousMonth = 6;
const dataSets = ["kSaoJVXNxZE", "TfoI3vTGv1f", "GzvLb3XVZbR", "cap79mdf6Co", "rm3y3VHPiFD", "zeEp4Xu2GOm"];
startApp();

async function startApp() {
    const periods = getLastMonthsIsoPeriod(numberOfPreviousMonth);
    for (const dataSet of dataSets) {
        for (const period of periods) {
            console.log(period)
            console.log(`Discovering data value for daa=ta set ${dataSet} period ${period} `)
            // const response = await getDataValueFromServer(souceServerUrl, sourceHeaders, dataSet, organisationUnitId, period);
            // const {
            //     dataValues
            // } = response;
            // const payload = {
            //     ...{},
            //     dataValues
            // }
            // const {
            //     importCount,
            //     status,
            //     conflicts
            // } = await uploadDataValuesToTheServer(serverUrl, headers, payload);
            // console.log(JSON.stringify({
            //     status,
            //     importCount,
            //     conflicts
            // }));
        }
    }

}