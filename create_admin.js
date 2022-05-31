const Account = require('./app/models/Account')
const bcrypt = require("bcrypt");
async function auto_create(){
    let admin = await Account.find({username: 'admin'}).lean()
    //console.log("Database cho bảng thống kê")
    console.log(admin)
    if(admin.length === 0){
        const hashed = bcrypt.hashSync('123456', 10)
        let data = {
            username: 'admin',
            password: hashed,
            email: 'phamhuynhanhtien123@gmail.com',
            name: 'Phạm Huỳnh Anh Tiến',
            role: 'admin',
            phone: '0582564369',
            address: 'Quận 9, tphcm',
            status: 'Admin',
            token: 1,
        }
        let account_admin = new Account(data)
        account_admin.save()
    }
}

module.exports = {auto_create}