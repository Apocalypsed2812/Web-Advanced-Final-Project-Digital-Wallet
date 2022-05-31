const schedule = require("node-schedule");
const OTP = require("../app/models/OTP");
const add_minutes = function (dt) {
    return new Date(dt.getTime() + 1 * 60000);
};
function deleteOTP(id) {
    const date = add_minutes(new Date());
    schedule.scheduleJob(date, async () => {
        await OTP.findByIdAndRemove(id);
    });
}

function createOTP() {
    let otp = ''
    for(let i = 0; i <= 5; i++){
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

module.exports = { deleteOTP, createOTP };
