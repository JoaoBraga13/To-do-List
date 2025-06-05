const mongoose = require('mongoose')
const {Schema} = mongoose

//Schema
const TarefaSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    descricao: {type: String, required: false},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
})

//Model
const TarefaModel = mongoose.model('Tarefa', TarefaSchema)

//classe
class Tarefa {
    constructor(body) {
        this.body = body
        this.errors = []
        this.tarefa = null
    }

    async criaTarefa(){
        try{
            this.valida()

            console.log(this.body)
            if(this.errors.length > 0) return
            this.tarefa = await TarefaModel.create(this.body)
            console.log(this.tarefa)

        } catch(e) {
            console.log(e)
        }
    }

    async deletaTarefa(id) {
        try{
            if(this.errors.length > 0) return

            await TarefaModel.findByIdAndDelete(id)

        } catch(e) {
            console.log(e)
        }
    }

    //busca tarefas ordenadas
    async buscaTarefas(userId) {
        const tarefas = await TarefaModel.find({user: userId})
        return tarefas
    }

    //valida se as informações passadas condizem com os requisitos da função clean()
    valida() {
        this.clean()

        if(!this.body.nome) this.errors.push('Valor inválido para este campo')
        if(!this.body.descricao) this.errors.push('Valor inválido para este campo')
    }

    //garantindo que os dados sejam strings
    clean() {
        for(const chave in this.body){
            if(typeof this.body[chave] !== 'string'){
                this.body[chave] = ''
            }
        }

        this.body = {
            nome: this.body.nome,
            descricao: this.body.descricao,
            user: this.body.user
        }
    }
}

//lógica para editar tarefa
Tarefa.TarefaModel = TarefaModel;

module.exports = Tarefa