const e = require('connect-flash');
const Tarefa = require('../models/TarefaModel');

exports.index = async (req, res) => {
  try {
    const tarefaInstance = new Tarefa({});
    const tarefas = await tarefaInstance.buscaTarefas();

    res.render('index', {
      tarefas,
      success: req.flash('success'),
      errors: req.flash('errors'),
    });
  } catch (e) {
    res.render('404');
  }
};

exports.criaTarefaPage = (req, res) => {
  res.render('tarefaCriar');
};

exports.criar = async (req, res) => {
  try {
    const tarefaInstance = new Tarefa(req.body);
    await tarefaInstance.criaTarefa();

    if (tarefaInstance.errors.length > 0) {
      req.flash('errors', tarefaInstance.errors);
      req.session.save(() => res.redirect('/tarefas/criar'));
      return;
    }

    req.flash('success', 'Tarefa criada com sucesso!');
    req.session.save(() => res.redirect('/'));
  } catch (e) {
    res.render('404');
  }
};

// Atualizar tarefa
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, descricao } = req.body;

    if (!id || !nome || !descricao) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const tarefaAtualizada = await Tarefa.TarefaModel.findByIdAndUpdate(id, { nome, descricao }, { new: true });

    if (!tarefaAtualizada) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

exports.deletar = async (req,res) => {
    try{
        const tarefaInstance = new Tarefa()
        const tarefa = await tarefaInstance.deletaTarefa(req.params.id)

        if(!tarefa) return res.render('404')

        req.flash('success', 'Tarefa apagada com sucesso!!')
        req.session.save( erro => {
          if (erro) console.log(e, res.render('404')) 
          return res.redirect('/')
        })

    } catch(e) {
        console.log(e)
        res.render('404')
      }
}
