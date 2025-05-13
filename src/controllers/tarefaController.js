const tarefaModel = require('../models/TarefaModel')

exports.index = async (req,res) => {
    res.render('index', {
        tarefas: {
            nome: 'teste',
            descricao: 'teste'
        }
    })
}

exports.criaTarefaPage = async (req,res) => {
    res.render('tarefaCriar')
}

exports.criar = async (req,res) => {
    try {
        console.log(req.body)
        const tarefas = new tarefaModel(req.body)
        await tarefas.criaTarefa()

        if(tarefas.errors.length > 0 ){
            req.flash('errors', tarefas.errors)
            req.session.save(() => {
                res.redirect('http://localhost:8080/tarefas/index')
            }) 
        }

        req.flash('success', 'Tarefa criada com sucesso!!')
        req.session.save(() => {
           res.redirect('/')
        }) 

        console.log(tarefas)

    } catch(e) {
        console.log(e)
        res.render('404')
    }    
}

exports.editar = async (req,res) => {
    res.render('editar.ejs')
}

