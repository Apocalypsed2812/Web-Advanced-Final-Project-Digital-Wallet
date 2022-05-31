module.exports = async function checkLogin(req, res, next){
    if(!req.session.change_password){
        if(!req.session.user_id){
            res.redirect('/change_password')
        }
        else{
            next()
        }  
    }
    else{
        next()
    }
}