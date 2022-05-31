const express = require('express');
const { renderHome } = require('../app/controllers/AccountController');
const router = express.Router()
const AdminController = require('../app/controllers/AdminController');
//const checkAdmin = require("../app/middleware/checkAdmin");
//const flash = require("../app/middleware/flashMessage");
const checkLogin = require("../app/middleware/checkLogin");

//Check Login
router.use(checkLogin)

//router.use(checkAdmin);
router.get('/home', AdminController.renderHome)
router.get('/account_xm', AdminController.renderHomeXM)
router.get('/account_h', AdminController.renderHomeH)
router.get('/account_bs', AdminController.renderHomeBS)
router.post('/updateStatusXM', AdminController.updateStatusXM)
router.post('/updateStatusH', AdminController.updateStatusH)
router.post('/updateStatusBSCMND', AdminController.updateStatusBSCMND)
router.post('/updateStatusMK', AdminController.updateStatusMK)
router.get('/pheduyetruttien', AdminController.renderRutTien)
router.get('/pheduyetchuyentien', AdminController.renderChuyenTien)
router.post('/accept', AdminController.acceptRutTien)
router.post('/denied', AdminController.deniedRutTien)
router.post('/accept_chuyen', AdminController.acceptChuyenTien)
router.post('/denied_chuyen', AdminController.deniedChuyenTien)
router.post('/viewAccountXM', AdminController.viewAccountXM)

module.exports = router;