import { orcamentos, pedidos, numeroOrcamento, numeroPedido, salvarDados } from './ui.js';

export function exportarDados() {
    const dadosParaExportar = JSON.stringify({ orcamentos, pedidos, numeroOrcamento, numeroPedido });
    const blob = new Blob([dadosParaExportar], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
    const dia = agora.getDate().toString().padStart(2, '0');
    const hora = agora.getHours().toString().padStart(2, '0');
    const minuto = agora.getMinutes().toString().padStart(2, '0');
    const nomeArquivo = `${ano}${mes}${dia}_${hora}${minuto}_Backup_Pérola_Rara.json`;

    localStorage.setItem('ultimoBackup', JSON.stringify({ nomeArquivo, data: agora.toISOString() }));

    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    atualizarPainelUltimoBackup();
}

export function importarDados(inputImportar) {
    if (!inputImportar || inputImportar.files.length === 0) {
        alert('Selecione um arquivo para importar.');
        return;
    }
    const arquivo = inputImportar.files[0];
    const nomeArquivo = arquivo.name;
    const leitor = new FileReader();

    leitor.onload = function (e) {
        try {
            const dadosImportados = JSON.parse(e.target.result);
            orcamentos = dadosImportados.orcamentos || [];
            pedidos = dadosImportados.pedidos || [];
            numeroOrcamento = dadosImportados.numeroOrcamento || 1;
            numeroPedido = dadosImportados.numeroPedido || 1;

            salvarDados();

            const match = nomeArquivo.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
            if (match) {
                const [, ano, mes, dia, hora, minuto] = match;
                const dataArquivo = new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}`);
                localStorage.setItem('ultimoBackup', JSON.stringify({ nomeArquivo, data: dataArquivo.toISOString() }));
            }

            alert('Dados importados com sucesso!');
            mostrarPagina('form-orcamento');
            atualizarPainelUltimoBackup();
        } catch (erro) {
            alert('Erro ao importar dados: ' + erro.message);
        }
    };

    leitor.readAsText(arquivo);
}

export function inicializarBackup() {
    // Aqui você pode adicionar ouvintes de eventos específicos para a área de backup, se necessário.
}
