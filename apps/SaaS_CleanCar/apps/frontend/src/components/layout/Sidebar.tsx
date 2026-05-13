"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        logout();
    };

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoArea} style={{ padding: '1rem', minHeight: '60px' }}>
                {user?.logo_url ? (
                    <img
                        src={`http://localhost:3333${user.logo_url}`}
                        alt="Logo da Empresa"
                        style={{ maxWidth: '100%', maxHeight: '60px', objectFit: 'contain' }}
                    />
                ) : (
                    <span>CleanCar</span>
                )}
            </div>

            {user?.is_saas_provider && (
                <div className={styles.nav}>
                    <div className={styles.sectionTitle} style={{ color: '#ffb822' }}>Super Admin</div>
                    <Link href="/saas-admin" className={`${styles.navItem} ${isActive('/saas-admin') ? styles.active : ''}`}>
                        <span className={styles.icon}>👑</span> Gestão SaaS
                    </Link>
                </div>
            )}

            {/* SEÇÃO: RELATÓRIOS (ADMIN) */}
            <div className={styles.nav}> {/* Using styles.nav for consistency, assuming it's a general container for nav sections */}
                <div className={styles.sectionTitle}>Relatórios</div>
                <Link href="/relatorios/faturamento" className={`${styles.navItem} ${isActive('/relatorios/faturamento') ? styles.active : ''}`}>
                    <span className={styles.icon}>📊</span> Faturamento
                </Link>
                <Link href="/relatorios/produtividade" className={`${styles.navItem} ${isActive('/relatorios/produtividade') ? styles.active : ''}`}>
                    <span className={styles.icon}>🏆</span> Produtividade
                </Link>
            </div>

            <nav className={styles.nav}>
                <div className={styles.sectionTitle}>Principal</div>
                <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
                    <span className={styles.icon}>📊</span>
                    Dashboard
                </Link>
                <Link href="/os" className={`${styles.navItem} ${isActive('/os') ? styles.active : ''}`}>
                    <span className={styles.icon}>🛠️</span>
                    Ordens de Serviço
                </Link>
                <Link href="/financeiro" className={`${styles.navItem} ${isActive('/financeiro') ? styles.active : ''}`}>
                    <span className={styles.icon}>💰</span>
                    Financeiro
                </Link>
                <Link href="/clientes" className={`${styles.navItem} ${isActive('/clientes') ? styles.active : ''}`}>
                    <span className={styles.icon}>👥</span>
                    Clientes
                </Link>
                <Link href="/servicos" className={`${styles.navItem} ${isActive('/servicos') ? styles.active : ''}`}>
                    <span className={styles.icon}>🔧</span>
                    Serviços
                </Link>
                <Link href="/funcionarios" className={`${styles.navItem} ${isActive('/funcionarios') ? styles.active : ''}`}>
                    <span className={styles.icon}>👷</span>
                    Funcionários
                </Link>
                <Link href="/unidades" className={`${styles.navItem} ${isActive('/unidades') ? styles.active : ''}`}>
                    <span className={styles.icon}>🏢</span>
                    Unidades
                </Link>
                <Link href="/combos" className={`${styles.navItem} ${isActive('/combos') ? styles.active : ''}`}>
                    <span className={styles.icon}>📦</span>
                    Combos
                </Link>

                <div className={styles.sectionTitle}>Sistema</div>
                <Link href="/assinatura" className={`${styles.navItem} ${isActive('/assinatura') ? styles.active : ''}`}>
                    <span className={styles.icon}>💳</span>
                    Assinatura SaaS
                </Link>
                <Link href="/configuracoes/usuarios" className={`${styles.navItem} ${isActive('/configuracoes/usuarios') ? styles.active : ''}`}>
                    <span className={styles.icon}>👤</span>
                    Usuários
                </Link>
                <Link href="/configuracoes" className={`${styles.navItem} ${isActive('/configuracoes') && !isActive('/configuracoes/usuarios') ? styles.active : ''}`}>
                    <span className={styles.icon}>⚙️</span>
                    Configurações
                </Link>
            </nav>

            <div className={styles.userProfile}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3699ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
                        {user?.nome?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.nome || 'Usuário'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#7e8299', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.email || 'email@não.informado'}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    title="Sair do Sistema"
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    🚪
                </button>
            </div>
        </aside>
    );
}
