const LoginModel = require('../models/LoginModel')

exports.loginHome = (req,res) => {
    if(req.session.user) {
        return res.render('logado')
    }
    else{
        return res.render('loginHome')
    }
}

//registro do usuário
exports.register = async function(req,res) {
    try{
        const login = new LoginModel(req.body) //instância com o corpo da requisição
        await login.register() //query para criar o usuário

        if(login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function() {
                res.redirect('http://localhost:8080/loginHome')
            })
            return
        }
        else {
            req.flash('success', 'Usuário criado com sucesso!!')
            req.session.save(function() {
                res.redirect('http://localhost:8080/loginHome')
            })
        }
    } catch(e) {
        return res.render('404')
    }
}

//autenticação do usuário
exports.login = async function(req, res){
    try{
        const login = new LoginModel(req.body)
        await login.login() //autentica usuário no BD

        if(login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function() {
                res.redirect('http://localhost:8080/loginHome')
            })
        }
        else{
            req.flash('success', 'Usuário logado com sucesso!!')
            req.session.user = login.user //armazena usuário na sessão
            req.session.save(function() {
                res.redirect('http://localhost:8080/loginHome')
            })
        }

    } catch(e) {
        res.render('404')
    }
}

//finalizando a sessão
exports.logout = async function(req,res) {
    req.session.destroy()
    res.redirect('/')
}
