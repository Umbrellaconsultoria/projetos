export default function Configuracoes() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Configurações</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <a href="/configuracoes/usuarios" className="card" style={{ textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '150px' }}>
                    <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</span>
                    <h3 className="text-lg font-bold">Usuários</h3>
                    <p style={{ color: '#666' }}>Gerenciar usuários do sistema</p>
                </a>

                <a href="/configuracoes/empresa" className="card" style={{ textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '150px' }}>
                    <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</span>
                    <h3 className="text-lg font-bold">Empresa</h3>
                    <p style={{ color: '#666' }}>Configurações da Logomarca e dados</p>
                </a>

                <a href="/configuracoes/papeis" className="card" style={{ textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '150px' }}>
                    <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</span>
                    <h3 className="text-lg font-bold">Papéis e Permissões</h3>
                    <p style={{ color: '#666' }}>Configurar níveis de acesso</p>
                </a>
            </div>
        </div>
    )
}
