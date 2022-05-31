//Create toast 
function toast({
	title='', 
	message='', 
	type = 'success', 
	duration = 3000
}) {
	const main = document.getElementById('toast');
	if(main){
		const toast = document.createElement('div');
		const icons = {
			success: 'fa fa-check-circle-o',
			error: 'fa fa-exclamation',
            infor: 'fa fa-exclamation',
		};
		const icon = icons[type];
		const delay = (duration/1000).toFixed(2);

		toast.classList.add('toast', `toast--${type}`);
		toast.style.animation = `slideInLeft ease 2s, fadeOut linear 3s 6s forwards`;

		toast.innerHTML = `
		<div class="toast__icon">
			<i class="" aria-hidden="true"></i>
		</div>
		<div class="toast__body">
			<h3 class="toast__title">${title}</h3>
			<p class="toast__msg">${message}</p>
		</div>
		<div class="toast__close">
			<i class="" aria-hidden="true"></i>
		</div>
		`;
		main.appendChild(toast);
		setTimeout(function(){
			main.removeChild(toast)
		}, duration + 1000)
	}
}

function showSuccessToast(input){
	toast({
		title: 'Success',
		message: input,
		type: 'success',
		duration: 1000
	})
}

function showErrorToast(input){
	toast({
		title: 'Error',
		message: input,
		type: 'error',
		duration: 1000
	})
}

function showNotifyToast(input) {
    toast({
        title: 'Notify',
        message: input,
        type: 'info',
        duration: 1000
    })
}


function validateLogin(username, password){

	if(username === ''){
		showErrorToast('Please enter your username')
		return false
	}
	if(password === ''){
		showErrorToast('Please enter your password')
		return false
	}
	if(password.length < 6){
		showErrorToast('Password must have at least 6')
		return false
	}
	return true
}

//POST login
$('#btn_login').click(e => {
	e.preventDefault()

	console.log("click")
	
	let username = $('#username').val()
	let password = $('#password').val()

	if(!validateLogin(username, password)){
		return 
	}

	fetch('/login', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'username=' + username + '&password=' + password,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log(json.data.token)
			if(json.data.token === 0){
				window.location.href = '/change_password'
			}
			else{
				if(json.data.status === 'đã vô hiệu hóa'){
					showErrorToast("Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008")
				}
				else{
					window.location.href = '/user/home'
				}
			}	
		}
		else if(json.code === 1){
			window.location.href = '/admin/home'
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})	

function validateChangePassword(pass, newpass, newpassconfirm){
	if(pass === ''){
		showErrorToast('Vui lòng nhập mật khẩu cũ')
		return false
	}
	if(newpass === ''){
		showErrorToast('Vui lòng nhập mật khẩu mới')
		return false
	}
	if(newpassconfirm === ''){
		showErrorToast('Vui lòng xác nhận mật khẩu mới')
		return false
	}
	if(newpass !== newpassconfirm){
		showErrorToast('Mật khẩu không khớp')
		return false
	}
	
	return true
}

//POST change password
$('#btn_change_password').click(e => {
	e.preventDefault()

	console.log("click")
	$('#change-password').modal('hide')
	
	
	let oldPassword = $('#oldPassword').val()
	let newPassword = $('#newPassword').val()
	let confirmPassword = $('#confirmPassword').val()

	if(!validateChangePassword(oldPassword, newPassword, confirmPassword)){
		return
	}

	fetch('/user/change_password', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'oldPassword=' + oldPassword + '&newPassword=' + newPassword + '&confirmPassword=' + confirmPassword,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log(json)
			showSuccessToast('Đổi mật khẩu thành công')
			setTimeout(() => {
				window.location.href = '/user/home'
			}, 2000)
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})	

//Change password user
function validateChangePasswordUser(pass, newpassconfirm){
	if(pass === ''){
		showErrorToast('Vui lòng nhập mật khẩu mới')
		return false
	}
	if(newpassconfirm === ''){
		showErrorToast('Vui lòng xác nhận mật khẩu mới')
		return false
	}
	if(pass !== newpassconfirm){
		showErrorToast('Mật khẩu không khớp')
		return false
	}
	
	return true
}

//POST change password
$('#btn_user_change_password').click(e => {
	e.preventDefault()

	console.log("click")
	$('#change-password').modal('hide')
	
	
	let password = $('#password').val()
	let password_confirm = $('#password_confirm').val()

	if(!validateChangePasswordUser(password, password_confirm)){
		return
	}

	fetch('/change_password', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'password=' + password + '&password_confirm=' + password_confirm,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log(json)
			showSuccessToast('Đổi mật khẩu thành công')
			setTimeout(() => {
				window.location.href = 'user/home'
			}, 2000)
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})	

function validateResetPassword(pass, passconfirm){
	if(pass === ''){
		showErrorToast('Vui lòng nhập mật khẩu mới')
		return false
	}
	if(passconfirm === ''){
		showErrorToast('Vui lòng xác nhận mật khẩu mới')
		return false
	}
	if(pass !== passconfirm){
		showErrorToast('Mật khẩu không khớp')
		return false
	}
	
	return true
}

//POST reset password
$('#btn_reset_password').click(e => {
	e.preventDefault()

	console.log("click")	
	
	let password = $('#password').val()
	let password_confirm = $('#password_confirm').val()

	if(!validateResetPassword(password, password_confirm)){
		return
	}

	fetch('/reset_password', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'password=' + password + '&password_confirm=' + password_confirm,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log(json)
			showSuccessToast('Reset mật khẩu thành công')
			setTimeout(() => {
				window.location.href = '/login'
			}, 2000)
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})	

//Register
// $('#btn_register').click(e => {
// 	e.preventDefault()

// 	let name = document.getElementById('name').value
// 	let email = document.getElementById('email').value
// 	let phone = document.getElementById('phone').value
// 	let address = document.getElementById('address').value
// 	let berore = document.getElementById('berore').value
// 	let after = document.getElementById('after').value

// 	let form = new FormData();
// 	form.append('email', email);
// 	form.append('name', name);
// 	form.append('phone', phone);
// 	form.append('address', address);
// 	form.append('berore', berore);
// 	form.append('after', after);

// 	// $.ajax({
// 	// 	url: '/register',
// 	// 	type: 'POST',
// 	// 	contentType: false,
// 	// 	data: form,
// 	// 	success: function (json) {
// 	// 		if (json.code === 0) {
// 	// 			showSuccessToast("Register Successfully")
// 	// 			setTimeout(() => {
// 	// 				window.location.href = '/login'
// 	// 			}, 2000)
// 	// 		} 
// 	// 		else if(json.code === 1){
// 	// 			showErrorToast("Phone or Email must unique")
// 	// 		}
// 	// 	}
// 	// })

// 	fetch('/regiter', {
// 		headers:{
// 			'Content-Type':'application/x-www-form-urlencoded'
// 		}, 
// 		method: 'POST',
// 		body: form,
// 	})
// 	.then(res => res.json())
// 	.then(json => {
// 		console.log(json)
// 		if(json.code === 0){
// 			showSuccessToast("Register Successfully")
// 			setTimeout(() => {
// 				window.location.href = '/login'
// 			}, 2000)
// 		}
// 		else if(json.code === 1){
// 			showErrorToast("Phone or Email must unique")
// 		}
// 		else{
// 			showErrorToast(json.message)
// 		}
// 	})
// 	.catch(e => console.log(e))
// })

$('.header-subitem-temp').click(e => {
	console.log("click")
	e.preventDefault()
	showErrorToast("Chức năng chỉ dành cho tài khoản đã kích hoạt")
})

$('.header-item-temp').click(e => {
	console.log("click")
	e.preventDefault()
	showErrorToast("Chức năng chỉ dành cho tài khoản đã kích hoạt")
})

//View Account
let viewAccount = document.querySelectorAll(".viewAccount")
viewAccount.forEach(item => {
	item.onclick = (e) => {
		if(e.target.closest(".mk")) return
		console.log(item)
		let username = item.getAttribute("data-username")
		let name = item.getAttribute("data-name")
		let phone = item.getAttribute("data-phone")
		let address = item.getAttribute("data-address")
		let email = item.getAttribute("data-email")
		let date = item.getAttribute("data-date")
		let before = item.getAttribute("data-before")
		let after = item.getAttribute("data-after")
		
		$('#username_acc_view').html(username)
		$('#name_acc_view').html(name)
		$('#phone_acc_view').html(phone)
		$('#address_acc_view').html(address)
		$('#email_acc_view').html(email)
		$('#date_acc_view').html(date)
		document.getElementById('before_acc_view').src = '/images/' + before
		document.getElementById('after_acc_view').src = '/images/' + after
	
		$('#view-account').modal('show')
	}
})

function formatNumber(num) {
    let dollarUSLocale = Intl.NumberFormat("en-US");
    let number = dollarUSLocale.format(parseInt(num));
    return number;
}

//View AccountXM
let viewAccountXM = document.querySelectorAll(".viewAccountXM")
viewAccountXM.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let username = item.getAttribute("data-username")
		let name = item.getAttribute("data-name")
		let phone = item.getAttribute("data-phone")
		let address = item.getAttribute("data-address")
		let email = item.getAttribute("data-email")
		let date = item.getAttribute("data-date")
		let before = item.getAttribute("data-before")
		let after = item.getAttribute("data-after")
		let balance = item.getAttribute("data-balance")
		
		$('#username_acc_view').html(username)
		$('#name_acc_view').html(name)
		$('#phone_acc_view').html(phone)
		$('#address_acc_view').html(address)
		$('#email_acc_view').html(email)
		$('#date_acc_view').html(date)
		$('#balance_acc_view').html(balance)
		document.getElementById('before_acc_view').src = '/images/' + before
		document.getElementById('after_acc_view').src = '/images/' + after

		fetch('/admin/viewAccountXM', {
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}, 
			method: 'POST',
			body:'username=' + username,
		})
		.then(res => res.json())
		.then(json => {
			console.log(json.data.length)
			if(json.code === 0){
				if(json.data.length > 0){
					let tbody = document.getElementById('tbody')
					let transactions = json.data
					let content = ``
					transactions.forEach(item => {
						let money = formatNumber(item.money)
						let total = formatNumber(item.total)
						content += `Loại giao dịch: ${item.type} </br>
						Số tiền: ${money} đ</br>
						Tổng cộng: ${total} đ</br>
						--------------------------- </br>`
					})
					tbody.innerHTML = content
				}
			}
		})
		.catch(e => console.log(e))
	
		$('#view-account').modal('show')
	}
})

let xm = document.querySelectorAll(".xm")
xm.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let username = item.getAttribute("data-username")
		let id = item.getAttribute("data-id")
	
		$('#btn-xm-confirm').attr('data-id', id)
		$('#account-name-xm').html(username)
		$('#view-account').modal('hide')
		$('#change-status-account-xm').modal('show')
	}
})

$('#btn-xm-confirm').click(e => {
	$('#change-status-account-xm').modal('hide')
	const btn = e.target
	let id = btn.dataset.id

	console.log(id)

	fetch('/admin/updateStatusXM', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'id=' + id,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log("Xác minh tài khoản thành công")
			showSuccessToast("Xác minh tài khoản thành công")
			setTimeout(() => {
				window.location.href = '/admin/account_xm'
			}, 2000)
		}
	})
	.catch(e => console.log(e))
})

let h = document.querySelectorAll(".h")
h.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let username = item.getAttribute("data-username")
		let id = item.getAttribute("data-id")
	
		$('#btn-h-confirm').attr('data-id', id)
		$('#account-name-h').html(username)
		$('#view-account').modal('hide')
		$('#change-status-account-h').modal('show')
	}
})

$('#btn-h-confirm').click(e => {
	$('#change-status-account-h').modal('hide')
	const btn = e.target
	let id = btn.dataset.id

	console.log(id)

	fetch('/admin/updateStatusH', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'id=' + id,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log("Hủy tài khoản thành công")
			showSuccessToast("Hủy tài khoản thành công")
			setTimeout(() => {
				window.location.href = '/admin/account_h'
			}, 2000)
		}
	})
	.catch(e => console.log(e))
})

let bscmnd = document.querySelectorAll(".bscmnd")
bscmnd.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let username = item.getAttribute("data-username")
		let id = item.getAttribute("data-id")
	
		$('#btn-bscmnd-confirm').attr('data-id', id)
		$('#account-name-bscmnd').html(username)
		$('#view-account').modal('hide')
		$('#change-status-account-bscmnd').modal('show')
	}
})

$('#btn_cmnd').click(e => {
	$('#add_cmnd').modal('show')
})

$('#btn-bscmnd-confirm').click(e => {
	$('#change-status-account-bscmnd').modal('hide')
	const btn = e.target
	let id = btn.dataset.id

	console.log(id)

	fetch('/admin/updateStatusBSCMND', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'id=' + id,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log("Yêu cầu bổ sung CMND thành công")
			showSuccessToast("Yêu cầu bổ sung CMND thành công")
			setTimeout(() => {
				window.location.href = '/admin/home'
			}, 2000)
		}
	})
	.catch(e => console.log(e))
})

//Unlock account
let mk = document.querySelectorAll(".mk")
mk.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let username = item.getAttribute("data-username")
		let id = item.getAttribute("data-id")
	
		$('#btn-mk-confirm').attr('data-id', id)
		$('#account-name-mk').html(username)
		$('#useranme_block').val(username)
		$('#change-status-account-mk').modal('show')
	}
})

$('#btn-mk-confirm').click(e => {
	$('#change-status-account-mk').modal('hide')
	const btn = e.target
	let id = btn.dataset.id
	let username = $('#useranme_block').val()

	console.log(id)
	console.log(username)

	fetch('/admin/updateStatusMK', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'id=' + id + '&username=' + username,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log("Mở khóa tài khoản thành công")
			showSuccessToast("Mở khóa tài khoản thành công")
			setTimeout(() => {
				window.location.href = '/admin/account_bs'
			}, 2000)
		}
	})
	.catch(e => console.log(e))
})

//Loading money
function validateNapTien(card_number, date_end, cvv_code, money){

	if(card_number === ''){
		showErrorToast('Vui lòng nhập số thẻ')
		return false
	}
	if(date_end === ''){
		showErrorToast('Vui lòng nhập ngày hết hạn')
		return false
	}
	if(cvv_code === ''){
		showErrorToast('Vui lòng nhập mã CVV')
		return false
	}
	if(cvv_code.length > 3){
		showErrorToast('Mã CVV không hợp lệ')
		return false
	}
	return true
}

$('#btn_naptien').click(e => {
	e.preventDefault()

	console.log("click")
	
	let number_card = $('#card_number_add').val()
	let date_end = $('#date_end_add').val()
	let cvv_code = $('#cvv_code_add').val()
	let money = $('#money_add').val()

	if(!validateNapTien(number_card, date_end, cvv_code, money)){
		return 
	}

	fetch('/user/naptien', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'number_card=' + number_card + '&date_end=' + date_end + '&cvv_code=' + cvv_code + '&money=' + money,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			showSuccessToast("Nạp tiền thành công")
			setTimeout(() => {
				window.location.href = "/user/home"
			}, 2000)
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})	

//Withdraw money
function validateRutTien(card_number, date_end, cvv_code, money, note){

	if(card_number === ''){
		showErrorToast('Vui lòng nhập số thẻ')
		return false
	}
	if(date_end === ''){
		showErrorToast('Vui lòng nhập ngày hết hạn')
		return false
	}
	if(cvv_code === ''){
		showErrorToast('Vui lòng nhập mã CVV')
		return false
	}
	if(note === ''){
		showErrorToast('Vui lòng nhập ghi chú')
		return false
	}
	if(cvv_code.length > 3){
		showErrorToast('Mã CVV không hợp lệ')
		return false
	}
	return true
}

$('#btn_ruttien').click(e => {
	e.preventDefault()

	console.log("click")
	
	let number_card = $('#card_number_out').val()
	let date_end = $('#date_end_out').val()
	let cvv_code = $('#cvv_code_out').val()
	let money = $('#money_out').val()
	let note = $('#note_out').val()

	if(!validateRutTien(number_card, date_end, cvv_code, money, note)){
		return 
	}

	fetch('/user/ruttien', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'number_card=' + number_card + '&date_end=' + date_end + '&cvv_code=' + cvv_code + '&money=' + money + '&note=' + note,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			showSuccessToast("Rút tiền thành công")
			setTimeout(() => {
				window.location.href = "/user/home"
			}, 2000)
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})	

//Buy Card
function validateMuaCard(quantity){

	if(quantity === ''){
		showErrorToast('Vui lòng nhập số lượng thẻ muốn mua')
		return false
	}
	if(quantity <= 0){
		showErrorToast('Số lượng không hợp lệ')
		return false
	}
	
	return true
}

$('#btn_muacard').click(e => {
	e.preventDefault()

	console.log("click")
	
	let name = $('#name_operator').val()
	let price = $('#price').val()
	let quantity = $('#quantity_card').val()

	if(!validateMuaCard(quantity)){
		return 
	}

	fetch('/user/muacard', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'name=' + name + '&price=' + price + '&quantity=' + quantity,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			showSuccessToast("Mua card thành công")
			setTimeout(() => {
				window.location.href = "/user/home"
			}, 2000)
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})

//Transfer Money
function validateChuyenTien(phone, money, name, otp, note){

	if(phone === ''){
		showErrorToast('Vui lòng nhập số điện thoại người nhận')
		return false
	}
	if(money === ''){
		showErrorToast('Vui lòng nhập số tiền muốn chuyển')
		return false
	}
	if(name === ''){
		showErrorToast('Vui lòng nhập tên người nhận')
		return false
	}
	if(otp === ''){
		showErrorToast('Vui lòng nhập mã otp')
		return false
	}
	if(note === ''){
		showErrorToast('Vui lòng nhập ghi chú')
		return false
	}
	if(money <= 0){
		showErrorToast('Số tiền không hợp lệ')
		return false
	}
	
	return true
}

const tranfer_money = document.querySelector(".banking-form");
if (tranfer_money) {
    const btn_sendotp = tranfer_money.querySelector('#btn_sendotp');

    btn_sendotp.addEventListener("click", (e) => {
        if (btn_sendotp.getAttribute("disable") == "disable") {
            return;
        }
        const phone_transfer = document.getElementById('phone_transfer').value;
        if (phone_transfer === "") {
            showErrorToast("Phone không được rỗng")
            return;
        }

		fetch('/user/otp', {
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}, 
			method: 'POST',
			body:'phone=' + phone_transfer + '&type=' + 'transfer_money',
		})
		.then(res => res.json())
		.then(json => {
			console.log(json)
			if(json.code === 0){
				showSuccessToast("Gửi OTP thành công")
				btn_sendotp.setAttribute("disable", "disable");
				let count = 0;
				let timer = setInterval(() => {
					btn_sendotp.innerHTML = `${60 - count} s`;
					count += 1;
					if (count == 59) {
						clearInterval(timer);
						btn_sendotp.removeAttribute("disable");
						btn_sendotp.innerHTML = `Gửi OTP`;
					}
				}, 1000);
			}
			else{
				showErrorToast(json.message)
			}
		})
		.catch(e => console.log(e))

    });
}

$('#phone_transfer').change(e => {
	console.log("change")
	let phone = $("#phone_transfer").val()
	console.log(phone)
	fetch('/user/name', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'phone=' + phone,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			console.log(json.data)
			$('#name_transfer').val(json.data.name)
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})

$('#btn_transfer').click(e => {
	e.preventDefault()

	console.log("click")
	
	let name = $('#name_transfer').val()
	let phone = $('#phone_transfer').val()
	let money = $('#money_transfer').val()
	let otp = $('#otp_transfer').val()
	let note = $('#note_transfer').val()
	let fee = $('#fee_transfer').val()

	if(!validateChuyenTien(phone, money, name, otp, note)){
		return 
	}

	fetch('/user/chuyentien', {
		headers:{
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		method: 'POST',
		body:'name=' + name + '&phone=' + phone + '&money=' + money + '&otp_code=' + otp + '&note=' + note + '&fee=' + fee,
	})
	.then(res => res.json())
	.then(json => {
		console.log(json)
		if(json.code === 0){
			showSuccessToast("Chuyển tiền thành công")
			setTimeout(() => {
				window.location.href = "/user/home"
			}, 2000)
		}
		else{
			showErrorToast(json.message)
		}
	})
	.catch(e => console.log(e))
})

//Forgot Password
const formForgotpass = document.querySelector(".forgot_password");
if (formForgotpass) {
    const btn_sendotp = formForgotpass.querySelector('#btn_sendotp');

    btn_sendotp.addEventListener("click", (e) => {
        if (btn_sendotp.getAttribute("disable") == "disable") {
            return;
        }
        const phone_forgot = document.getElementById('phone_forgot').value;
        const email_forgot = document.getElementById('email_forgot').value;
        if (phone_forgot === "") {
            showErrorToast("Phone không được rỗng")
            return;
        }
        if (email_forgot === "") {
            showErrorToast("Email không được rỗng")
            return;
        }

		fetch('/otp', {
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}, 
			method: 'POST',
			body:'email=' + email_forgot + '&phone=' + phone_forgot + '&type=' + 'forgot_password',
		})
		.then(res => res.json())
		.then(json => {
			console.log(json)
			if(json.code === 0){
				showSuccessToast("Gửi OTP thành công")
				btn_sendotp.setAttribute("disable", "disable");
				let count = 0;
				let timer = setInterval(() => {
					btn_sendotp.innerHTML = `${60 - count} s`;
					count += 1;
					if (count == 59) {
						clearInterval(timer);
						btn_sendotp.removeAttribute("disable");
						btn_sendotp.innerHTML = `Gửi OTP`
					}
				}, 1000);
			}
			else{
				showErrorToast(json.message)
			}
		})
		.catch(e => console.log(e))

    });
}


//Toast for register
const register_display_toast = document.querySelector('.register_display_toast')
if(register_display_toast){
	let infor_exist_register = document.querySelector("#check_toast")
	if(infor_exist_register){
		if(infor_exist_register.value == 0){
			showErrorToast('Email and phone is unique')
			console.log('Show toast ok')
		}
	}	
}

const register_display_toast_date = document.querySelector('.register_display_toast_date')
if(register_display_toast_date){
	let infor_exist_register_date = document.querySelector("#check_toast_date")
	if(infor_exist_register_date){
		if(infor_exist_register_date.value == 0){
			showErrorToast('Age less than 18 or invalid')
			console.log('Show toast ok')
		}
	}	
}

//Check display card
const buy_card = document.querySelector(".buy-card")
if(buy_card){
	let card_content = buy_card.querySelector("#card_content")
	if(card_content){
		if(card_content.value == 1){
			let content = $('#card_content_content').val()
			console.log(content)
			$('#content_card').html(content)
			$('#display_card_content').modal('show')
		}
	}
}

//View NapTien
let viewNapTien = document.querySelectorAll(".viewNapTien")
viewNapTien.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let number_card = item.getAttribute("data-number_card")
		let money = item.getAttribute("data-money")
		let type = item.getAttribute("data-type")
		let status = item.getAttribute("data-status")
		let date = item.getAttribute("data-date")
		
		$('#number_card_tran_view').html(number_card)
		$('#date_tran_view').html(date)
		$('#money_tran_view').html(money)
		$('#type_tran_view').html('Nạp Tiền')
		$('#status_tran_view').html('Thành Công')
	
		$('#view-naptien').modal('show')
	}
})

//View RutTien
let viewRutTien = document.querySelectorAll(".viewRutTien")
viewRutTien.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let number_card = item.getAttribute("data-number_card")
		let money = item.getAttribute("data-money")
		let type = item.getAttribute("data-type")
		let status = item.getAttribute("data-status")
		let note = item.getAttribute("data-note")
		
		$('#number_card_tran_view').html(number_card)
		$('#money_tran_view').html(money)
		$('#type_tran_view').html('Rút tiền')
		$('#status_tran_view').html(status)
		$('#note_tran_view').html(note)
	
		$('#view-ruttien').modal('show')
	}
})

//View ChuyenTien
let viewChuyenTien = document.querySelectorAll(".viewChuyenTien")
viewChuyenTien.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		console.log(item)
		let number_card = item.getAttribute("data-number_card")
		let money = item.getAttribute("data-money")
		let type = item.getAttribute("data-type")
		let status = item.getAttribute("data-status")
		let note = item.getAttribute("data-note")
		let phone = item.getAttribute("data-phone")
		let fee = item.getAttribute("data-fee")
		let receiver = item.getAttribute("data-receiver")
		let userpay = item.getAttribute("data-userpay")
		let id = item.getAttribute("data-id")
		let date = item.getAttribute("data-date")
		let total = item.getAttribute("data-total")

		money = formatNumber(money)
		fee = formatNumber(fee)
		total = formatNumber(total)
		
		//$('#number_card_tran_view').html(number_card)
		$('#money_tran_view_transfer_user').html(money + ' vnd')
		$('#type_tran_view_transfer_user').html('Chuyển tiền')
		$('#status_tran_view_transfer_user').html(status)
		$('#note_tran_view_transfer_user').html(note)
		$('#date_tran_view_transfer_user').html(date)
		$('#sender_tran_view_transfer_user').html(phone)
		$('#receiver_tran_view_transfer_user').html(receiver)
		$('#fee_tran_view_transfer_user').html(fee + ' vnd')
		$('#total_tran_view_transfer_user').html(total + ' vnd')
	
		$('#view-chuyentien').modal('show')
	}
})

//View MuaCrad
let viewMuaCard = document.querySelectorAll(".viewMuaCard")
viewMuaCard.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let number_card = item.getAttribute("data-number_card")
		let money = item.getAttribute("data-money")
		let type = item.getAttribute("data-type")
		let status = item.getAttribute("data-status")
		let denomination = item.getAttribute("data-denomination")
		let date = item.getAttribute("data-date")
		let operator = item.getAttribute("data-operator")
		let quantity = item.getAttribute("data-quantity")
		let content = item.getAttribute("data-content")

		let total = formatNumber(money)
		
		//$('#number_card_tran_view_buy').html(number_card)
		$('#money_tran_view_buy').html(total + ' vnđ')
		$('#type_tran_view_buy').html('Mua thẻ')
		$('#status_tran_view_buy').html('Thành Công')
		$('#denomination_tran_view_buy').html(denomination + ' vnđ')
		$('#date_tran_view_buy').html(date)
		$('#operator_tran_view_buy').html(operator)
		$('#quantity_tran_view_buy').html(quantity)
		$('#content_tran_view_buy').html(content)
	
		$('#view-muacard').modal('show')
	}
})

//View PheDuyetRutTien
let viewPheDuyetRutTien = document.querySelectorAll(".viewPheDuyetRutTien")
viewPheDuyetRutTien.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let id = item.getAttribute("data-id")
		let number_card = item.getAttribute("data-number_card")
		let money = item.getAttribute("data-money")
		let type = item.getAttribute("data-type")
		let status = item.getAttribute("data-status")
		let note = item.getAttribute("data-note")
		let total = item.getAttribute("data-total")
		let phone = item.getAttribute("data-phone")
		
		$('#number_card_tran_view').html(number_card)
		$('#money_tran_view').html(money)
		$('#type_tran_view').html('Rút tiền')
		$('#status_tran_view').html('Đợi admin duyệt')
		$('#note_tran_view').html(note)

		$('#btn-rut-confirm').attr('data-id', id)
		$('#phone_rut').val(phone)
		$('#total_rut').val(total)

		$('#btn-rut-confirm-denied').attr('data-id', id)
	
		$('#view-pheduyet-ruttien').modal('show')
	}
})

$('#btn_accept_rut').click(e => {
	$('#view-pheduyet-ruttien').modal('hide')
	$('#confirm-accept-rut').modal('show')
	$('#btn-rut-confirm').click(e => {
		$('#confirm-accept-rut').modal('hide')
		const btn = e.target
		const id = btn.dataset.id
		let phone = $('#phone_rut').val()
		let total = $('#total_rut').val()

		fetch('/admin/accept', {
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}, 
			method: 'POST',
			body:'id=' + id + '&phone=' + phone + '&total=' + total,
		})
		.then(res => res.json())
		.then(json => {
			console.log(json)
			if(json.code === 0){
				showSuccessToast("Đồng ý cho rút tiền")
				setTimeout(() => {
					window.location.href = '/admin/pheduyetruttien'
				},2000)
			}
			else{
				showErrorToast(json.message)
			}
		})
		.catch(e => console.log(e))
		})
})

$('#btn_denied_rut').click(e => {
	$('#view-pheduyet-ruttien').modal('hide')
	$('#confirm-denied-rut').modal('show')
	$('#btn-rut-confirm-denied').click(e => {
		$('#confirm-denied-rut').modal('hide')
		const btn = e.target
		const id = btn.dataset.id

		fetch('/admin/denied', {
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}, 
			method: 'POST',
			body:'id=' + id,
		})
		.then(res => res.json())
		.then(json => {
			console.log(json)
			if(json.code === 0){
				showSuccessToast("Từ chối cho rút tiền")
				setTimeout(() => {
					window.location.href = '/admin/pheduyetruttien'
				},2000)
			}
			else{
				showErrorToast(json.message)
			}
		})
		.catch(e => console.log(e))
	})
})

//View PheDuyetRutTien
let viewPheDuyetChuyenTien = document.querySelectorAll(".viewPheDuyetChuyenTien")
viewPheDuyetChuyenTien.forEach(item => {
	item.onclick = (e) => {
		console.log(item)
		let number_card = item.getAttribute("data-number_card")
		let money = item.getAttribute("data-money")
		let type = item.getAttribute("data-type")
		let status = item.getAttribute("data-status")
		let note = item.getAttribute("data-note")
		let phone = item.getAttribute("data-phone")
		let fee = item.getAttribute("data-fee")
		let receiver = item.getAttribute("data-receiver")
		let userpay = item.getAttribute("data-userpay")
		let id = item.getAttribute("data-id")
		let date = item.getAttribute("data-date")
		let total = item.getAttribute("data-total")

		$('#btn-chuyen-confirm').attr('data-id', id)
		$('#phone_chuyen').val(phone)
		$('#money_chuyen').val(money)
		$('#fee_chuyen').val(fee)
		$('#receiver_chuyen').val(receiver)
		$('#userpay_chuyen').val(userpay)

		money = formatNumber(money)
		fee = formatNumber(fee)
		total = formatNumber(total)
		
		//$('#number_card_tran_view').html(number_card)
		$('#money_tran_view_transfer').html(money + ' vnd')
		$('#type_tran_view_transfer').html('Chuyển tiền')
		$('#status_tran_view_transfer').html('Đợi admin duyệt')
		$('#note_tran_view_transfer').html(note)
		$('#date_tran_view_transfer').html(date)
		$('#sender_tran_view_transfer').html(phone)
		$('#receiver_tran_view_transfer').html(receiver)
		$('#fee_tran_view_transfer').html(fee + ' vnd')
		$('#total_tran_view_transfer').html(total + ' vnd')

		$('#btn-chuyen-confirm-denied').attr('data-id', id)
	
		$('#view-pheduyet-chuyentien').modal('show')
	}
})

$('#btn_accept_chuyen').click(e => {
	$('#view-pheduyet-chuyentien').modal('hide')
	$('#confirm-accept-chuyen').modal('show')
	$('#btn-chuyen-confirm').click(e => {
		$('#confirm-accept-chuyen').modal('hide')
		const btn = e.target
		const id = btn.dataset.id
		let phone = $('#phone_chuyen').val()
		let money = $('#money_chuyen').val()
		let fee = $('#fee_chuyen').val()
		let receiver = $('#receiver_chuyen').val()
		let userpay = $('#userpay_chuyen').val()
		console.log(receiver)

		fetch('/admin/accept_chuyen', {
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}, 
			method: 'POST',
			body:'id=' + id + '&phone=' + phone + '&money=' + money + '&fee=' + fee + '&receiver=' + receiver + '&userpay=' + userpay,
		})
		.then(res => res.json())
		.then(json => {
			console.log(json)
			if(json.code === 0){
				showSuccessToast("Đồng ý cho chuyển tiền")
				setTimeout(() => {
					window.location.href = '/admin/pheduyetchuyentien'
				},2000)
			}
			else{
				showErrorToast(json.message)
			}
		})
		.catch(e => console.log(e))
		})
})

$('#btn_denied_chuyen').click(e => {
	$('#view-pheduyet-chuyentien').modal('hide')
	$('#confirm-denied-chuyen').modal('show')
	$('#btn-chuyen-confirm-denied').click(e => {
		$('#confirm-denied-chuyen').modal('hide')
		const btn = e.target
		const id = btn.dataset.id

		fetch('/admin/denied_chuyen', {
			headers:{
				'Content-Type':'application/x-www-form-urlencoded'
			}, 
			method: 'POST',
			body:'id=' + id,
		})
		.then(res => res.json())
		.then(json => {
			console.log(json)
			if(json.code === 0){
				showSuccessToast("Từ chối cho chuyển tiền")
				setTimeout(() => {
					window.location.href = '/admin/pheduyetchuyentien'
				},2000)
			}
			else{
				showErrorToast(json.message)
			}
		})
		.catch(e => console.log(e))
	})
})



window.addEventListener("load", function () {
	const toggle = document.querySelector(".menu-toggle");
	const menu = document.querySelector(".menu");
	toggle && toggle.addEventListener("click", handleToggleMenu);
	function handleToggleMenu(e) {
	  menu && menu.classList.add("is-show");
	}
	document.addEventListener("click", handleClickOutside);
	function handleClickOutside(e) {
	  if (e.target.matches(".menu-toggle") || e.target.matches(".menu, .menu *"))
		return;
	  menu && menu.classList.remove("is-show");
	}
  });
  
// let btnToggleOption = document.querySelector('.btn-option-header')
// if(btnToggleOption){
// 	btnToggleOption.onclick = (e) => {
// 		let parent = btnToggleOption.parentNode
// 		let menu = parent.querySelector('.header-option-menu')
// 		menu.classList.toggle("active")
// 	}
// }
