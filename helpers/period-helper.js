function getLastMonthsIsoPeriod(numberOfPreviousMonth) {
    let date = new Date();
    let month = date.getMonth();
    const periods = [];
    for (let index = 0; index < numberOfPreviousMonth; index++) {
        if (month - index <= 0) {
            month += 12;
            date.setFullYear(date.getFullYear() - 1);
        }
        const year = date.getFullYear();
        let isoMonth = month - index;
        isoMonth = isoMonth < 10 ? `0${isoMonth}` : `${isoMonth}`
        const isoPeriod = `${year}${isoMonth}`;
        periods.push(isoPeriod);
    }
    return periods;
}

module.exports = {
    getLastMonthsIsoPeriod
}