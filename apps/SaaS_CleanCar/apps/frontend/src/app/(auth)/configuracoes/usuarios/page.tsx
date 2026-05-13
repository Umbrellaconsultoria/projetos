"use client";

import { Header } from "@/components/layout/Header";
import { usuariosService, Usuario } from "@/services/usuarios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsuariosList() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        usuariosService.getAll()
            .then(setUsuarios)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Header
                title="Usuários do Sistema"
                rightAction={
                    <Link href="/configuracoes/usuarios/novo" style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.4rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                    }}>
                        + Novo Usuário
                    </Link>
                }
            />
            <div className="p-6">
                <div className="card">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '1rem' }}>Nome</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Perfil</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan={3} className="p-4 text-center">Carregando...</td></tr> :
                                usuarios.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{u.nome}</td>
                                        <td style={{ padding: '1rem' }}>{u.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {u.papeis.map(p => p.papel.nome).join(', ') || '-'}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link href={`/configuracoes/usuarios/${u.id}`} style={{
                                                color: 'var(--color-primary)',
                                                fontWeight: 600,
                                                textDecoration: 'none'
                                            }}>
                                                Editar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
