/*
O propósito deste arquivo é identificar as rotas e chamar um controlador para a nossa aplicação e aí 
o controlador decide qual view e qual model deve ser usado

Um controller deve ser criado para cada feature que iremos trabalhar, por exemplo, todo o código que for feito 
referente a uma home page deverá ter um controller.
*/

const express = require('express')
const route = express.Router()


//controllers
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const tarefaController = require('./src/controllers/tarefaController')

//middlewares
const {loginRequired} = require('./src/middlewares/middleware')

//Rotas da home
route.get('/', homeController.paginaInicial)

//rota login
route.get('/loginHome', loginController.loginHome)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

//rotas lista de tarefas
route.get('/tarefas/index', loginRequired, tarefaController.index)
route.get('/tarefas/criar', loginRequired, tarefaController.criaTarefaPage)
route.post('/tarefas/criar', loginRequired, tarefaController.criar)
//route.get('/tarefas/:id/editar', loginRequired, tarefaController.editar)
route.put('/tarefas/:id/editar', loginRequired, tarefaController.editar)

module.exports = route
