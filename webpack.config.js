const path = require('path') //CommonJS; importa o módulo path para trabalhar com caminhos de arquivos e diretórios

module.exports = {      //exporta a configuração do webpack usando CommonJS. Usa esse objeto para construir o projeto
    mode: 'development', //define o modo de compilação. Pode ser development ou production
    entry: './frontend/main.js', //define o ponto de entrada da apliação. O webpack começa a construir o grafo de dependencias a partir deste arquivo
    output: { //configura onde e como os arquivos gerados pelo webpack serão armazenados
        path: path.resolve(__dirname, 'public', 'assets', 'js'), //especifica o caminho absoluto do diretório onde o webpackcolocará o arquivo de saida
        filename: 'bundle.js' //define o nome do arquivo de saída
    },
    module: { // define regras para como os diferentes tipos de arquivos serão proessados
        rules: [{
            exclude: /node_modules/, //exclui os arquivos dessa pasta do processamento, já que não é necessário transpilar dependências externas
            test: /\.js$/,  //define quais arquivos essa regra deve se aplicar; expressão regular
            use: { //específica o loader para processar arquivos .js
                loader: 'babel-loader', //usa o babel para transpilar o javascript
                options: {
                    presets: ['@babel/env'] //configura para usar o env, que converte o código para navegadores antigos
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    }, 
    devtool: 'source-map' //gera mapas de origem, que permitem depurar o código original mesmo que ele esteja empacotado e/ou minificado
}
