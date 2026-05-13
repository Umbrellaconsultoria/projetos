export const PERMISSIONS = {
    // Ordens de Serviço
    CRIAR_ORDEM_SERVICO: 'criar_ordem_servico',
    EDITAR_ORDEM_SERVICO: 'editar_ordem_servico',
    ALTERAR_STATUS_ORDEM_SERVICO: 'alterar_status_ordem_servico',
    CANCELAR_ORDEM_SERVICO: 'cancelar_ordem_servico',
    VISUALIZAR_ORDEM_SERVICO: 'visualizar_ordem_servico',
    APLICAR_DESCONTO_MANUAL: 'aplicar_desconto_manual',
    GERAR_PDF_ORDEM_SERVICO: 'gerar_pdf_ordem_servico',

    // Financeiro
    REGISTRAR_PAGAMENTO: 'registrar_pagamento',
    EDITAR_PAGAMENTO: 'editar_pagamento',
    VISUALIZAR_FINANCEIRO: 'visualizar_financeiro',
    ABRIR_CAIXA: 'abrir_caixa',
    FECHAR_CAIXA: 'fechar_caixa',
    REABRIR_CAIXA: 'reabrir_caixa',
    VISUALIZAR_RELATORIOS_FINANCEIROS: 'visualizar_relatorios_financeiros',

    // Usuários e Acesso
    CRIAR_USUARIO: 'criar_usuario',
    EDITAR_USUARIO: 'editar_usuario',
    DESATIVAR_USUARIO: 'desativar_usuario',
    GERENCIAR_PAPEIS: 'gerenciar_papeis',
    GERENCIAR_PERMISSOES: 'gerenciar_permissoes',

    // Cadastros Gerais
    CRIAR_UNIDADE: 'criar_unidade',
    EDITAR_UNIDADE: 'editar_unidade',
    VISUALIZAR_UNIDADES: 'visualizar_unidades',
    CRIAR_CLIENTE: 'criar_cliente',
    EDITAR_CLIENTE: 'editar_cliente',
    VISUALIZAR_CLIENTES: 'visualizar_clientes',
    CRIAR_VEICULO: 'criar_veiculo',
    EDITAR_VEICULO: 'editar_veiculo',
    VISUALIZAR_VEICULOS: 'visualizar_veiculos',
    CRIAR_SERVICO: 'criar_servico',
    EDITAR_SERVICO: 'editar_servico',
    VISUALIZAR_SERVICOS: 'visualizar_servicos',
    EDITAR_PRECOS: 'editar_precos',
    CRIAR_COMBO: 'criar_combo',
    EDITAR_COMBO: 'editar_combo',
    VISUALIZAR_COMBOS: 'visualizar_combos',
    GERENCIAR_FUNCIONARIOS: 'gerenciar_funcionarios',

    // Relatórios
    VISUALIZAR_RELATORIOS_OPERACIONAIS: 'visualizar_relatorios_operacionais',
    EXPORTAR_RELATORIOS: 'exportar_relatorios',

    // Configurações
    GERENCIAR_CONFIGURACOES: 'gerenciar_configuracoes',
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
