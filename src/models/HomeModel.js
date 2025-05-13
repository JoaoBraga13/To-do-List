//geralmente o model vai ser uma classe, por isso é importante criar o arquivo com a primeira letra maiuscula
//o mongoDB não está nem aí sobre como os dados estarão lá, então nós devemos tratar e modelar os dados 

const mongoose = require('mongoose')

const HomeSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    descricao: String
})

const HomeModel = mongoose.model('Home', HomeSchema) //instância do model

module.exports = HomeModel
