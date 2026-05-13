"use client";

import { Header } from "@/components/layout/Header";
import { rbacService, Papel } from "@/services/rbac";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function PapeisPage() {
    const [papeis, setPapeis] = useState<Papel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPapeis();
    }, []);

    const fetchPapeis = async () => {
        try {
            const data = await rbacService.getAllRoles();
            setPapeis(data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar papéis');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este papel?')) return;
        try {
            await rbacService.deleteRole(id);
            fetchPapeis();
        } catch (error: any) {
            toast.error('Erro ao excluir: ' + (error.response?.data?.message || 'Erro desconhecido'));
        }
    };

    return (
        <>
            <Header title="Papéis de Acesso" />
            <div className="p-6">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <Link href="/configuracoes/papeis/novo" style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.4rem',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        + Novo Papel
                    </Link>
                </div>

                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <div className="card">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Nome</th>
                                    <th style={{ textAlign: 'left', padding: '1rem' }}>Permissões</th>
                                    <th style={{ textAlign: 'center', padding: '1rem' }}>Usuários</th>
                                    <th style={{ textAlign: 'right', padding: '1rem' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {papeis.map(papel => (
                                    <tr key={papel.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <strong>{papel.nome}</strong>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
                                            {papel.permissoes.length} permissões
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{ padding: '0.25rem 0.5rem', background: '#eee', borderRadius: '1rem', fontSize: '0.8rem' }}>
                                                {papel._count?.usuarios || 0}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                                <Link href={`/configuracoes/papeis/${papel.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                                    Editar
                                                </Link>
                                                {/* Only allow delete if not admin or system roles if needed, for now allow all but handle backend error */}
                                                <button
                                                    onClick={() => handleDelete(papel.id)}
                                                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 600 }}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {papeis.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                Nenhum papel cadastrado.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
