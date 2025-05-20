require('dotenv').config()

//iniciando express
const express = require('express')
const app = express()

//parte da modelagem de dados, criação do schema e retorna promises, por isso .then()
const mongoose = require('mongoose') 
mongoose.connect(process.env.CONNECTIONSTRING) 
    .then(() => {
        console.log('conectei a base de dados')
        app.emit('pronto')
    })
    .catch(e => console.log(e))

const session = require('express-session') //os cookies
const MongoStore = require('connect-mongo') //salvar as sessões dentro do banco de dados
const flash = require('connect-flash') //mensagens auto-destrutivas

const routes = require('./routes.js') //rotas da nossa aplicação
const path = require('path') //trabalhar com caminhos absolutos e relativos
const helmet = require('helmet') //segurança
const csrf = require('csurf') //tokens para que nenhum site externo poste coisas dentro na nossa aplicação 
const methodOverride = require('method-override')
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware.js') //middlewares 

app.use(helmet()) //usando helmet

app.use(express.urlencoded({extended: true})) //tratar o req.body e postar formulários
app.use(express.json())  
app.use(express.static(path.resolve(__dirname, 'public'))) //usado para arquivos estáticos (imgs, css, JS...)
app.use(methodOverride('_method'))

//configurando Session
const sessionOptions = session({
    secret:'ajdajdaijd',
    store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})
app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views')) //arquivos que renderizamos na tela
app.set('view engine', 'ejs') //engine usada para renderizar o arquivo (html, ejs etc...)

app.use(csrf()) //usando e configurando token csrf

//Nossos próprios middlewares
app.use(middlewareGlobal)
app.use(checkCsrfError) 
app.use(csrfMiddleware)
app.use(routes)

//Assim que a conexão com o mongoose for feita, começamos a ouvir requisições
app.on('pronto', () => {  
    app.listen(8080, () => {
        console.log('http://localhost:8080')
        console.log('servidor rodando na porta 8080')
    })
})

