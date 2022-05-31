const express = require('express');
const router = express.Router()

const AccountController = require('../app/controllers/AccountController');

// [GET] /login
router.get('/', AccountController.renderHome)

// [GET] /login
router.get('/login', AccountController.renderLogin)

// [POST] /login
router.post('/login', AccountController.loginByAccount)

// [GET] /register
router.get('/register', AccountController.renderRegister)

// [POST] /register
router.post('/register', AccountController.register)

// [GET] /change_password
router.get('/change_password', AccountController.renderChangePassword)

// [POST] /change_password
router.post('/change_password', AccountController.changePassword)

// [GET] /forgot_password
router.get('/forgot_password', AccountController.renderForgotPassword)

// [POST] /otp
router.post('/otp', AccountController.createOTP)

// [POST] /forgot_password
router.post('/forgot_password', AccountController.forgotPassword)

// [GET] /reset_password
router.get('/reset_password', AccountController.renderResetPassword)

// [POST] /reset_password
router.post('/reset_password', AccountController.resetPassword)

// log out
router.get('/logout', AccountController.logOut)

module.exports = router