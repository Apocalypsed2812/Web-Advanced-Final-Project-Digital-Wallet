const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const multiparty = require('multiparty');
const upload = require('../../upload');
const crypto = require('crypto');
const nodemailer =  require('nodemailer');
const OTP = require('../models/OTP');
const otp = require('../../util/OTP');
const jwt = require("jsonwebtoken");
const credentials = require("../../credentials");
const checkLogin = require('../models/CheckLogin')
const block_account = require('../../util/block_account');
const { mailHost, mailUser, mailPass, mailPort } = process.env;

class AccountController{

    renderLogin(req, res){
        if(req.session.change){
            return res.redirect("/change_password")
        }
        res.render('./login')
    }

    renderRegister(req, res){
        if(req.session.change){
            return res.redirect("/change_password")
        }
        let error = req.flash('info_exist') || ''
        let error_date = req.flash('date_eighteen') || ''
        res.render('./register', {error, error_date})
    }

    renderHome(req, res){
        // if(!req.session.user_id){
        //     return res.redirect("/login")
        // }
        if(req.session.change){
            return res.redirect("/change_password")
        }
        res.render('./index')
    }

    renderChangePassword(req, res){
        if(!req.session.user_id){
            return res.redirect("/login")
        }
        req.session.change = 'change_password'
        res.render('./change_password')
    }

    renderForgotPassword(req, res){
        res.render('./forgot_password')
    }

    async createOTP(req, res, next) {
        const { phone, email, type} = req.body;
        const acc = await Account.findOne({ phone, email }).lean();
        if (!acc) {
            return res.json({ code: 1, message: "Tài khoản không tồn tại!" });
        }

        const otpfind = await OTP.findOne({ phone, type });
        if (otpfind) {
            await OTP.findOneAndDelete({ phone, type });
        }
        const otpCode = otp.createOTP();
        const data = { phone, code: otpCode, type };
        const o = new OTP(data);
        await o.save();
        otp.deleteOTP(o._id);
        console.log("OTP CODE: ", otpCode);
        sendMailOTP(email, otpCode, type);
        return res.json({ code: 0, message: "Create OTP Sucessfully" });
    }


    async forgotPassword(req, res){
        const { phone_forgot, email_forgot, otp_code } = req.body;
        const optFind = await OTP.findOne({ phone: phone_forgot, code: otp_code, type: "forgot_password" });
        if (!optFind) {
            // req.session.flash = {
            //     type: "error",
            //     message: "Otp Code is not correct!",
            //     title: "Error!",
            // };
            console.log("OTP đã hết hạn")
            res.redirect("/forgot_password");
            return;
        } else {
            const tokenObj = { phone_forgot };
            const token = jwt.sign(tokenObj, credentials.cookieSecret);
            res.cookie("resetpass", token, {
                maxAge: 900000,
                httpOnly: true,
            });
            res.redirect("/reset_password");
            return;
        }
    }

    renderResetPassword(req, res){
        res.render('./reset_password')
    }

    async resetPassword(req, res){
        const token = req.cookies.resetpass;
        if (!token) {
            console.log("Token cần thiết để reset password")
            res.redirect("/login");
            return;
        }
        const decoded = jwt.verify(token, credentials.cookieSecret);
        const account = await Account.findOne({
            phone: decoded.phone_forgot,
        }).lean();

        if (!account) {
            console.log("Taì khoản không tồn tại")
            res.redirect("/login");
        }
        const newPassword = req.body.password;
        const confirmPassword = req.body.password_confirm;
        if (newPassword !== confirmPassword) {
            //res.send("Mật khẩu không khớp");
            console.log("Mật khẩu không khớp")
        } else {
            console.log(account)
            const hash = await bcrypt.hash(newPassword, 10);
            await Account.findOneAndUpdate(
                { _id: account._id },
                { password: hash }
            );
            return res.json({code: 0, message: 'Reset mật khẩu thành công'})
        }
    }

    // renderRegister(req, res, next) {
    //     //delete req.session.user_id;
    //     let error = req.flash('error') || ''
    //     res.render("./register", {error});
    // }

    async loginByAccount(req, res, next) {
        let username = req.body.username;
        let password = req.body.password;
        console.log(username)
        console.log(password)
        let error = ' '
        if(!username || username === ' '){
            console.log('Thiếu thông tin đầu vào')
            return res.json({code: 2, message: 'Thiếu tham số đầu vào'})
        }
        else if(!password || password === ' '){
            console.log('Thiếu thông tin đầu vào')
            return res.json({code: 2, message: 'Thiếu tham số đầu vào'})
        }
        else{
            let account = await Account.findOne({ username });
            let login_check = await checkLogin.findOne({ username });
            if (!login_check) {
                let data = { username };
                let lc = new checkLogin(data);
                await lc.save();
            }
            if(login_check){
                if (login_check.count === 3 && login_check.unusual == 1) {
                    return res.json({code: 6, message: 'Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút'})
                }
            }
            if (account) {
                if (account.status === "khóa") {
                    return res.json({code: 5, message: 'Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ'});
                }
                if (bcrypt.compareSync(password, account.password)) {
                    req.session.user_id = account._id;
                    await checkLogin.findOneAndUpdate({ username }, { count: 0, unusual: 0 });
                    if (account.role === "admin") {
                        req.account = account
                        return res.json({code: 1, message: 'Đăng nhập admin thành công'})
                    } 
                    else if(account.role === "user") {
                        req.account = account
                        return res.json({code: 0, message: 'Đăng nhập user thành công', data: account})
                    } 
                } else {
                    //req.session.flash = setFlashMessage('error', 'Invalid account', "Tài khoản hoặc mật khẩu không chính xác")
                    console.log('Sai mật khẩu')
                    if (account.role === "user") {
                        let count = login_check.count + 1;
                        await checkLogin.findOneAndUpdate(
                            { username },
                            { count }
                        );
                        if (login_check.count === 2 && login_check.unusual == 0) {
                            let unusual = login_check.unusual + 1;
                            await checkLogin.findOneAndUpdate({ username }, { unusual });
                            block_account.blockOneMinutes(username);
                            return res.json({code: 6, message: 'Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút'})
                        } 
                        else if (login_check.count === 2 && login_check.unusual == 1) {
                            let unusual = login_check.unusual + 1;
                            await checkLogin.findOneAndUpdate({ username }, { unusual });
                            await Account.findOneAndUpdate(
                                { username },
                                { status: "khóa" }
                            );
                            return res.json({code: 5, message: 'Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ'});
                        }
                    }
                    return res.json({code: 3, message: 'Sai mật khẩu'}) 
                }
            } 
            else {
                console.log("Không tìm thấy account")
                return res.json({code: 4, message: 'Tài khoản không tồn tại'})
            }
        }
    }

    logOut(req, res, next) {
        delete req.session.user_id;
        delete req.session.change_password;
        res.redirect("/login");
    }

    async register(req, res, next) {
        let username = ''
        for(let i = 0; i <= 9; i++){
            username += Math.floor(Math.random() * 10);
        }
        let password = crypto.randomBytes(3).toString('hex')
        let hashed = bcrypt.hashSync(password, 10)
        let accounts = await Account.find({}).lean()
        let flag = 0
        let today = new Date()
        const form = new multiparty.Form()
        form.parse(req, (err, fields, files) => {
            if (err){
                //return res.json({code: 2, message: 'Has orrcured error'})
                console.log(err)
            }
            // console.log(fields)
            // console.log(files)
            // console.log(accounts)
            accounts.forEach(item => {
                if(item.email === fields.email[0] || item.phone === fields.phone[0]){
                    console.log("Trùng thông tin")
                    flag = 1
                    //return res.json({code: 1, message: 'Trùng thông Tin'})
                }
            })
            if((today.getFullYear() - fields.dob[0].split("-")[0]) < 18){
                req.flash("date_eighteen", "date_eighteen")
                res.redirect('/register')
                return
            }
            if(flag === 1){
                req.flash("info_exist", "info_exist")
                res.redirect('/register')
                return
            }
            upload(files.before[0].path, files.before[0].originalFilename)
            upload(files.after[0].path, files.after[0].originalFilename)
            let account = new Account({
                email: fields.email[0], 
                name: fields.name[0], 
                phone: fields.phone[0],
                address: fields.address[0],
                before: files.before[0].originalFilename,
                after: files.after[0].originalFilename,
                date: fields.dob[0],
                status: "chờ xác minh",
                role: "user",
                password: hashed,
                username,
                token: 0,
            })
            account.save()
            sendMail(fields.email[0], username, password)
            res.redirect('/login')   
        })
        return
    }

    async checkChangePassword(req, res){
        let account = await Account.find({_id: req.session.user_id})
        if(account.token === 0){
            res.redirect('/change_password')
        }
    }

    async changePassword(req, res){
        const password = req.body.password;
        const password_confirm = req.body.password_confirm;
        const hash = await bcrypt.hash(password, 10);
        await Account.findByIdAndUpdate(req.session.user_id, {password: hash, token: 1}, {
            new: true
        })
        //res.redirect("/logout");
        req.session.change_password = 'true'
        delete req.session.change
        return res.json({code: 0, message: 'Đổi mật khẩu thành công'})
    }

}

// send Mail
function sendMail(email, username, password) {
    //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
    var transporter =  nodemailer.createTransport({ // config mail server
        host: mailHost,
        port: mailPort,
        //secure: true,
        auth: {
            user: mailUser, //Tài khoản gmail vừa tạo
            pass: mailPass //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `Send Email By Nodemailer`
    contentHTML = `<p>Username của bạn là ${username} </p> 
                    <p>Password của bạn là ${password} </p> 
                    <p>Bạn đã có thể tiến hành đăng nhập và đổi mật khẩu</p>`;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: mailUser,
        to: email,
        subject: 'Gửi Username và Password cho ví điện tử',
        text: content,
        html: contentHTML, //Nội dung html mình đã tạo trên kia :))
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
            //res.redirect('/login');
        } else {
            console.log('Message sent: ' +  info.response);
            //res.redirect('/login');
        }
    });
}

// send Mail
function sendMailOTP(email, code, type) {
    //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
    var transporter =  nodemailer.createTransport({ // config mail server
        host: mailHost,
        port: mailPort,
        secure: true,
        auth: {
            user: mailUser, //Tài khoản gmail vừa tạo
            pass: mailPass //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `Send Email By Nodemailer`
    contentHTML = `<div>
                        <p>Mã OTP của bạn là ${code} </p>  
                        <p>Thời hạn nhập OTP là 1 phút</p>
                    </div>`;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: mailUser,
        to: email,
        subject: 'Gửi OTP để lấy lại mật khẩu',
        text: content,
        html: contentHTML, //Nội dung html mình đã tạo trên kia :))
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
            //res.redirect('/login');
        } else {
            console.log('Message sent: ' +  info.response);
            //res.redirect('/login');
        }
    });
}

module.exports = new AccountController
