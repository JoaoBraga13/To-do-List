import 'core-js/stable'
import 'regenerator-runtime/runtime'
import './assets/css/style.css'

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-editar').forEach(botao => {
        botao.addEventListener('click', () => {
            const linha = this.closest('form')
            linha.querySelector('.texto-nome').classList.add('d-none')
            linha.querySelector('.texto-descricao').classList.add('d-none')
            linha.querySelector('.input-nome').classList.remove('d-none')
            linha.querySelector('.input-descricao').classList.remove('d-none')
            this.classList.add('d-none') // esconde botão
            linha.querySelector('.btn-salvar').classList.remove('d-none') // mostrar salvar
        })
    })
})
