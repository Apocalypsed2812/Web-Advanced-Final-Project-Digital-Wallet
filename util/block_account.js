const schedule = require("node-schedule");
const CheckLogin = require("../app/models/CheckLogin");

const add_minutes = function (dt) {
    return new Date(dt.getTime() + 1 * 60000);
};
function blockOneMinutes(username) {
    const date = add_minutes(new Date());
    schedule.scheduleJob(date, async () => {
        await CheckLogin.findOneAndUpdate({ username }, { count: 0 });
    });
}

module.exports = { blockOneMinutes };