//importações
const mongoose = require('mongoose')
const validator  = require('validator')
const bcryptjs = require('bcryptjs')

//definição do schema
const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
})

//criação do modelo
const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body
        this.errors = []
        this.user = null
    }

    //criação de usuário
    async register() {
        this.valida()
        if(this.errors.length > 0) return

        await this.userExists()
        if(this.errors.length > 0) return 

        //bcrypt
        const salt = await bcryptjs.genSalt()
        this.body.password = await bcryptjs.hash(this.body.password, salt)
        
        //registrando no BD
        this.user = await LoginModel.create(this.body)
    }

    //autenticação do usuário
    async login() {
        this.valida()
        if(this.errors.length > 0) return

        this.user = await LoginModel.findOne({email: this.body.email}) //procura o email no bd

        if(!this.user){
            this.errors.push('usuário não existe!')
            return
        }

        if(!await bcryptjs.compare(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida')
            this.user = null
            return
        }
    
    }

    //valida se o usuário já existe no BD
    async userExists() {
        this.user = await LoginModel.findOne({email: this.body.email})
        if(this.user) {
            this.errors.push('usuário já existe')
        }
    }

    //validando dados do formulário
    valida() {
        this.clean()

        //validando email
        if(!validator.isEmail(this.body.email)) {
            this.errors.push("O e-mail está fora do padrão") 
        }

        //validando password
        if(this.body.password.length <= 3 || this.body.password.length > 16) {
            this.errors.push("A senha precisa ter pelo menos 3 caracteres")
        }
    }

    //limpando dados passados no body (campos form)
    clean() {
        for(const chave in this.body) {
            if(typeof this.body[chave] !== 'string') {
                this.body[chave] = ''
            }
        }

        //especifica os dados que precisam ser enviados no body
        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}

//exportar classe
module.exports = Login
