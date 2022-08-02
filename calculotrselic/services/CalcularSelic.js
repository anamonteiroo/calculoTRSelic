import { getKnex } from "../knex";

const calcularIndiceSelic = async function(dataInicial, dataFinal) 
{
    const knex = getKnex();

    const taxas = await knex('selic')
        .select('dt_efetiva', 'vr_taxa')
        .where('dt_efetiva', '>=', dataInicial)
        .andWhere('dt_efetiva', '<=', dataFinal);

    var taxa = 1;
    var taxaAnterior = 1;

    taxas.forEach((taxaDiaria, index) => {
        if(index == 0) {
            taxaAnterior = taxaDiaria.vr_taxa;
        } else {
            taxa = taxa * ((taxaAnterior / 100) + 1);
            taxaAnterior = taxaDiaria.vr_taxa;
        }
    });
    return taxa.toFixed(8);
}

const calcularSelicParaOValor = async function(valor, dataInicial, dataFinal) {
    const taxa = await calcularIndiceSelic(dataInicial, dataFinal);
    return (valor * taxa).toFixed(2);
}

export { calcularSelicParaOValor, calcularIndiceSelic };