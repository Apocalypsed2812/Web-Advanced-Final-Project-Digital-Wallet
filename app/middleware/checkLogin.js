const Account = require("../models/Account");
module.exports = async function checkLogin(req, res, next){
    const account = await Account.findOne({ _id: req.session.user_id }).lean();
    if (account) {
        if(!req.session.change_password){
            if(account.token !== 1){
                res.redirect('/change_password')
            }
            else{
                req.account = account;
                next()
            }
        }
        else{
            req.account = account;
            next();
        }   
    } 
    else {
        console.log('Chưa đăng nhập');
        res.redirect("/login");
    }
}