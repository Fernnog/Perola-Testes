import { inicializarOrcamentos } from './modules/orcamentos.js';
import { inicializarPedidos } from './modules/pedidos.js';
import { inicializarRelatorios } from './modules/relatorios.js';
import { inicializarBackup } from './modules/backup.js';
import { carregarDados, mostrarPagina, atualizarPainelUltimoBackup } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    inicializarOrcamentos();
    inicializarPedidos();
    inicializarRelatorios();
    inicializarBackup();
    mostrarPagina('form-orcamento');
    atualizarPainelUltimoBackup();
});
