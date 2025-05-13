/*
Um middleware é uma função que intercepta e processa requisições(req) e repostas(res) antes que cheguem ao
destino final (como um controlador ou rota). Eles são fundamentais para adicionar funcionalidades como
autenticação, logs, manipulação de erros etc.

Parâmetros recebidos: (req, res, next)
- req -> objeto da requisição
- res -> objeto da resposta
- next -> função que chama o próximo middleware da cadeia **nunca esquecer de colocar**

Um middleware pode: 
1- modificar a requisição ou a resposta antes de passá-la adiante
2- Encerrar a resposta sem chamar next()
3- passar o controle para o próximo middleware chamando next()

Tipos de middlewares:
-Middlewares de Aplicação -> aplicados globalmente a todas as rotas
-Middlewares de rotas -> aplicados a uma rota específica
-Middlewares integrados do Express -> Já vem no Express, como o express.json() e express.urlencoded
-Middlewares de terceiros -> plugins externos
-Middlewares de tratamento de erros -> Captura e lida com erros

*/


exports.middlewareGlobal = (req,res,next) => {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user
    next()
}

exports.loginRequired = (req,res,next) => {
    if(!req.session.user) {
        req.flash('errors', 'Você precisa fazer o login')
        req.session.save(() => res.redirect('/'))
        return
    }
    
    next()
}

exports.outroMiddleware = (req,res,next) => {
    next()
}

/*
module.exports = (req, res, next) => {
    if(req.body.cliente) {
        req.body.cliente = req.body.cliente.replace('Joao','NAO USE Joao')
        console.log()
        console.log(`Vi que você postou ${req.body.cliente}`)
        console.log()
    }
    next()
}
    */

exports.checkCsrfError = (err, req, res, next) => {
    if(err && 'EBADCSRFTOKEN' === err.code) {
        return res.render('404')
    }
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}
