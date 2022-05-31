const Account = require('../models/Account');
const bcrypt = require("bcrypt");
const checkLogin = require('../models/CheckLogin')
const Transaction = require('../models/Transaction')

class AdminController {

    // [GET] /admin/home
    async renderHome(req, res, next) {
        let account = await Account.find({status: 'chờ xác minh'}).sort({createdAt: -1, updateAt: -1}).lean()
        // let account = new Array()
        // accounts.forEach(item => {
        //     if(item.status === 'chờ xác minh'){
        //         account.push(item)
        //     }
        // })
        console.log(account)
        res.render('./admin/home', {account});
    }

    // [GET] /admin/home
    async renderHomeXM(req, res, next) {
        let account = await Account.find({status: 'đã xác minh'}).sort({createdAt: -1}).lean()
        res.render('./admin/homeXM', {account});
    }

    // [POST] /admin/viewAccountXM
    async viewAccountXM(req, res){
        let {username} = req.body
        let account = await Account.findOne({username}).lean()
        let transactions = new Array()
        let dateObj = new Date();
            let month = dateObj.getUTCMonth() + 1;
            let year = dateObj.getUTCFullYear();
            let ts = await Transaction.find({ phone: account.phone }).lean();
            ts.forEach((t) => {
                let create = String(t.createdAt);
                let args = create.split(" ");
                let y = args[3];
                let mon = args[1];
                let d = Date.parse(mon + "1, 2012");
                let m = new Date(d).getMonth() + 1;
                if (
                    parseInt(year) === parseInt(y) &&
                    parseInt(month) === parseInt(m)
                ) {
                    transactions.push(t);
                }
            });
        return res.json({code: 0, message: 'Hiển thị lịch sử giao dịch thành công', data: transactions})
    }

    // [GET] /admin/home
    async renderHomeH(req, res, next) {
        let account = await Account.find({status: 'đã vô hiệu hóa'}).sort({createdAt: -1}).lean()
        // let account = new Array()
        // accounts.forEach(item => {
        //     if(item.status === 'chờ xác minh'){
        //         account.push(item)
        //     }
        // })
        console.log(account)
        res.render('./admin/homeH', {account});
    }

    // [GET] /admin/home
    async renderHomeBS(req, res, next) {
        let account = await Account.find({status: 'khóa'}).sort({createdAt: -1, updateAt: -1}).lean()
        // let account = new Array()
        // accounts.forEach(item => {
        //     if(item.status === 'chờ xác minh'){
        //         account.push(item)
        //     }
        // })
        console.log(account)
        res.render('./admin/homeBS', {account});
    }

    //[POST] /admin/updateStatusXM
    updateStatusXM(req, res){
        let {id} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        let status = 'đã xác minh'
        Account.findByIdAndUpdate(id, {status}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài khoản để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    //[POST] /admin/updateStatusXM
    updateStatusH(req, res){
        let {id} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        let status = 'đã vô hiệu hóa'
        Account.findByIdAndUpdate(id, {status}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài khoản để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    //[POST] /admin/updateStatusBSCMND
    updateStatusBSCMND(req, res){
        let {id} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        let status = 'chờ cập nhật'
        Account.findByIdAndUpdate(id, {status}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài khoản để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    //[POST] /admin/updateStatusMK
    async updateStatusMK(req, res){
        let {id, username} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        let status = 'đã xác minh'
        await checkLogin.findOneAndUpdate({ username }, { count: 0, unusual: 0 });
        Account.findByIdAndUpdate(id, {status}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài khoản để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    async renderRutTien(req, res){
        let transaction = await Transaction.find({status: 'doi_duyet_rut'}).sort({createdAt: -1}).lean()
        console.log(transaction)
        res.render('./admin/lichsugiaodich_rut', {transaction});
    }

    async renderChuyenTien(req, res){
        let transaction = await Transaction.find({status: 'doi_duyet_chuyen'}).sort({createdAt: -1}).lean()
        console.log(transaction)
        res.render('./admin/lichsugiaodich_chuyen', {transaction});
    }
    
    async acceptRutTien(req, res){
        let {id, phone, total} = req.body
        let account = await Account.findOne({phone}).lean()
        console.log(account)
        if(account.balance < total){
            return res.json({code: 1, message: 'Số dư tài khoản không đủ để rút tiền'})
        }
        console.log(account.balance)
        console.log(total)
        console.log(id)
        let balance = account.balance - total
        console.log(balance)
        await Account.findOneAndUpdate(
            { phone },
            { balance },
        );
        Transaction.findByIdAndUpdate(id, {status: 'thanhcong'}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Cập nhật thất bại"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: 'Có lỗi xảy ra'})
        })
    }

    deniedRutTien(req, res){
        let {id} = req.body

        Transaction.findByIdAndUpdate(id, {status: 'tuchoi'}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Cập nhật thất bại"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: 'Có lỗi xảy ra'})
        })
    }

    async acceptChuyenTien(req, res){
        let {id, phone, money, fee, receiver, userpay} = req.body
        let account = await Account.findOne({phone}).lean()
        let account_receiver = await Account.findOne({phone: receiver}).lean()
        console.log("Tài khoản chuyển: ", account)
        console.log("Tài khoản nhận: ", account_receiver)
        console.log(receiver)
        let total = parseInt(money) + parseInt(fee)
        let balance_sender = 0
        let balance_receiver = 0
        if(userpay === 'sender'){
            console.log(account.balance)
            console.log(total)
            if(account.balance < total){
                return res.json({code: 1, message: 'Không đủ tiền để chuyển'})
            }
            balance_sender = parseInt(account.balance) - total;
            balance_receiver = parseInt(account_receiver.balance) + parseInt(money);
            console.log(balance_sender)
            console.log(balance_receiver)
        } else {
            if(account_receiver.balance < fee){
                return res.json({code: 1, message: 'Không đủ phí để nhận tiền'})
            }
            balance_sender = parseInt(account.balance) - parseInt(money);
            balance_receiver =
                parseInt(account_receiver.balance) +
                parseInt(money) -
                parseInt(fee);
        }
        await Account.findOneAndUpdate(
            { phone: phone },
            { balance: balance_sender }
        );
        await Account.findOneAndUpdate(
            { phone: receiver },
            { balance: balance_receiver }
        );
        
        Transaction.findByIdAndUpdate(id, {status: 'thanhcong'}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Cập nhật thất bại"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: 'Có lỗi xảy ra'})
        })
    }

    deniedChuyenTien(req, res){
        let {id} = req.body

        Transaction.findByIdAndUpdate(id, {status: 'thanhcong'}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Cập nhật thất bại"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: 'Có lỗi xảy ra'})
        })
    }
}

module.exports = new AdminController;