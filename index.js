const _ = require('lodash');
const {
    getDataValueFromServer,
    uploadDataValuesToTheServer,
    getLastMonthsIsoPeriod,
    getFacilityByOuAndDataSet
} = require('./helpers/index');
const {
    sourceConfig,
    destinationConfig,
    dataSetConfig
} = require('./config/index');


const sourceHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer.from(`${sourceConfig.username}:${sourceConfig.password}`).toString('base64')
};
const destinationHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + new Buffer.from(`${destinationConfig.username}:${destinationConfig.password}`).toString('base64')
};
const souceServerUrl = sourceConfig.url;
const destinationServerUrl = destinationConfig.url;
const numberOfPreviousMonth = (process.argv[2]) ? process.argv[2] : 3;
const ouChunkSize = (process.argv[2]) ? 50 : 100;
const periodsData = _.chunk(getLastMonthsIsoPeriod(numberOfPreviousMonth).reverse(), 3);

startApp();

async function startApp() {
    for (const dataSetId of Object.keys(dataSetConfig)) {
        console.log(`Discovering facilities for ${dataSetId} data set`);
        const ouArray = dataSetConfig[dataSetId];
        const dataSets = [dataSetId];
        let facilities = [];
        for (ou of ouArray) {
            console.log(`For facility in ${ou} organisation unit`);
            try {
                const ous = await getFacilityByOuAndDataSet(destinationServerUrl, destinationHeaders, dataSetId, ou);
                facilities = _.concat(facilities, ous);
            } catch (error) {
                console.log(`Error on fetching facility for ${dataSetId} data set on ${ou} ${JSON.stringify(error)}`)
            }
        }
        // checking if number of facilities is greater than one
        if (facilities.length > 0) {
            for (const periods of periodsData) {
                const organisationUnitsArray = _.chunk(_.map(facilities, organisationUnit => organisationUnit.id), ouChunkSize);
                for (const organisationUnitArray of organisationUnitsArray) {
                    console.log("Discovering data values");
                    try {
                        const response = await getDataValueFromServer(souceServerUrl, sourceHeaders, dataSets, organisationUnitArray, periods);
                        const {
                            dataValues
                        } = response;
                        const dataValuesData = _.chunk(dataValues, 500);
                        for (const data of dataValuesData) {
                            try {
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
                            } catch (error) {
                                console.log(`Error on uploading data values ${JSON.stringify(error)}`);
                            }
                        }
                    } catch (error) {
                        console.log(`Error on fetching data values ${JSON.stringify(error)}`);
                    }
                }
            }
        }
    }
}