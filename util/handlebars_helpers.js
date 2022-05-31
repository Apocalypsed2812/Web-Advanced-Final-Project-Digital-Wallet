const helpers = {
    mul: (a,b) => Number(a) * Number(b),
    checkStatusAccount: (status) => {
        if(status === 'chờ xác minh'){
            return true
        }
        else{
            return false
        }
    },
    addCMND: (status, id) => {
        let body = ``
        if(status === 'chờ cập nhật'){
            body += `<button class="btn btn-outline-primary" id="btn_cmnd">Bổ sung CMND/CCCD</button>`
        }
        return body
    },

    card_content_edit : () => {
        return 1
    },

    change_number: (number) => {
        let num = formatNumber(number)
        return num
    },

    format_date: date =>  date.toLocaleDateString("en-US", options)
    
}
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function formatNumber(num) {
    let dollarUSLocale = Intl.NumberFormat("en-US");
    let number = dollarUSLocale.format(parseInt(num));
    return number;
}
module.exports = helpers