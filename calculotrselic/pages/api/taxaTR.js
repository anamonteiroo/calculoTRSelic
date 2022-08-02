//seta o knex na variável
const knex = require('../../config/database')

export default async(req, res) => {

    //seta o metodo chamado da api
    const method = req.method;

    //seta a data final da busca da taxa, que é a data de hoje. toLocaleDateString() faz a data ficar no formato dd/mm/yyy
    let dataFinal = new Date().toLocaleDateString();

    //seta a data de hoje
    let dataInicial = new Date();

    //seta a data de hoje - 90 dias
    dataInicial.setDate(dataInicial.getDate() - 90);

    //seta a data inicial da busca, que é 90 dias atrás. toLocaleDateString() faz a data ficar no formato dd/mm/yyy
    dataInicial = dataInicial.toLocaleDateString();

    //faz o fetch da api do bcb e joga a resposta no jason
    const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.226/dados?formato=json&dataInicial=' + dataInicial + '&dataFinal=' + dataFinal);
    const data = await response.json()

    //seta as variáveis para separar os dados que serão inseridos no banco
    let dia = 0;
    let mes = 0;
    let ano = 0;
    let dataTR = 0;
    let dataEfetiva = 0;
    let dataFim = 0;
    let validaData = 0;
    let arrayTR = [];

    //mapeia os dados vindos da api. Para cada dado ele verifica se existe a data no banco. Caso contrário,
    //popula o array para que só fiquem os dados que ainda não foram inseridos
    data.map(async dados => {
        
        //transforma a data de dd/mm/yyyy para yyyy-mm-dd
        dia = dados.datafim.split("/")[0];
        mes = dados.datafim.split("/")[1];
        ano = dados.datafim.split("/")[2];

        dataTR = ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);

        //valida quais dados são repetidos e separa os que são para inserir no banco
        validaData = await knex('tr')
            .where('dt_fim', dataTR)
            .first()
            //usar o .then(valores) faz com que os valores do banco sejam mostrados. Sem isso, é só a query. Semelhante ao ->get() do eloquent
            .then(valores => {
                if(valores === undefined){
                    
                    //transforma a data de dd/mm/yyyy para yyyy-mm-dd
                    dia = dados.data.split("/")[0];
                    mes = dados.data.split("/")[1];
                    ano = dados.data.split("/")[2];

                    dataEfetiva = ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);

                    //transforma a data de dd/mm/yyyy para yyyy-mm-dd
                    dia = dados.datafim.split("/")[0];
                    mes = dados.datafim.split("/")[1];
                    ano = dados.datafim.split("/")[2];

                    dataFim = ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);

                    //joga os dados separados no array para inserção no banco
                    arrayTR.push({dt_efetiva: dataEfetiva, dt_fim: dataFim, vr_taxa: parseFloat(dados.valor)})
                }
            })
    })

    //verifica qual metodo foi chamado e direciona para o caso correto
    switch(method){
        case 'GET':
            //passa a resposta do get para json e mostra
            res.status(200).json(data);
            break;
        case 'POST':
            //tenta inserir o array de valores separados anteriormente no banco.
            try {
                await knex('tr').insert(arrayTR);
                res.status(200).end(`Valores inseridos no Banco de Dados`)

            } catch (error) {
                console.log(error)
                res.status(500).end(`Erro ao inserir dados no banco`)
            }
            break;
        //define os métodos permitidos e mostra mensagem caso tentem um método não permitido
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Método ${method} não permitido`);
    }
}


