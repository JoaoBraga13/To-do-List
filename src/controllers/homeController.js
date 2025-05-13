const HomeModel = require('../models/HomeModel')
const Tarefa = require('../models/TarefaModel')

exports.paginaInicial = async (req, res) => {
    const tarefas = await (new Tarefa({})).buscaTarefas()
    res.render('index', {tarefas})
}

