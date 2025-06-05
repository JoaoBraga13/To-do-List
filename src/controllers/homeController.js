const HomeModel = require('../models/HomeModel')
const Tarefa = require('../models/TarefaModel')

exports.paginaInicial = async (req, res) => {
    const tarefas = req.session.user 
    ? await (new Tarefa({})).buscaTarefas(req.session.user._id) : []
    res.render('index', {tarefas})
}

