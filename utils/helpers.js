const moment = require("moment");

const getEndDate = (startDate, weeks) => {
	if (startDate && weeks) {
		const parsedDate = moment(new Date(startDate), "YYYY-MM-DD");
		const daysToAdd = weeks * 7 - 3; //subtract starting day and last saturday,sunday
		const resultDate = parsedDate.add(daysToAdd, "days");

		return resultDate.format("YYYY-MM-DD");
	}
	return;
};

//* MUST CATCH THROWN ERROR
const validateStartDate = (startDate) => {
	if (startDate) {
		const parsedDate = moment(new Date(startDate), "YYYY-MM-DD").local();
		if (parsedDate.day() !== 1) {
			return;
		}

		return parsedDate;
	}
	return;
};

//* MUST CATCH THROWN ERROR
function countTotalRun(startDate) {
	if (startDate) {
		const currentDate = moment();
		const parsedDate = moment(startDate, "YYYY-MM-DD");
		const diffDays = currentDate.diff(parsedDate, "days");
		const currentWeek = Math.ceil(diffDays / 7);
		return currentWeek;
	}

	return;
}

function calculateEndDateByWeeks(date, weeks) {
	const startDate = moment(date).format("YYYY-MM-DD");
	return moment(startDate).add(weeks, "weeks").format("YYYY-MM-DD");
}

const formateDate = (date) => {
	if (date) {
		return moment(date).format("YYYY-MM-DD");
	}
};

function calculateEndDateByDays(startDate, days) {
	const day = moment(startDate).format("YYYY-MM-DD");
	let totalDays = Number(days) - 1;
	let addDays = 1;
	while (addDays < totalDays) {
		addDays++;
		const date = moment(day).add(addDays, "days");
		if (date.days() === 6 || date.days() === 0) {
			totalDays++;
		}
	}
	return moment(day).add(totalDays, "days").format("YYYY-MM-DD");
}

function populateWeeksDate(start_date, weeks) {
	const startDate = moment(new Date(start_date), "DD/MM/YYYY");

	const weekRanges = [];

	for (let i = 0; i < weeks; i++) {
		const currentStartDate = moment(startDate).add(i * 7, "days");
		const currentEndDate = moment(currentStartDate).add(6, "days");

		const formattedStartDate =
			moment(currentStartDate).format("YYYY-MM-DD");
		const formattedEndDate = moment(currentEndDate).format("YYYY-MM-DD");

		weekRanges.push({
			start_date: formattedStartDate,
			end_date: formattedEndDate,
		});
	}
	return weekRanges;
}

module.exports = {
	getEndDate,
	validateStartDate,
	countTotalRun,
	calculateEndDateByWeeks,
	populateWeeksDate,
	calculateEndDateByDays,
	formateDate,
};
