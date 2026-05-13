'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { funcionariosService, Funcionario } from '@/services/funcionarios';

export default function FuncionariosPage() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        funcionariosService.findAll().then(data => {
            setFuncionarios(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Deseja realmente remover este funcionário?')) {
            await funcionariosService.delete(id);
            setFuncionarios(funcionarios.filter(f => f.id !== id));
        }
    };

    return (
        <>
            <Header
                title="Funcionários"
                rightAction={
                    <Link href="/funcionarios/novo" style={{
                        backgroundColor: 'var(--color-success)',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.4rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span>+</span> Novo Funcionário
                    </Link>
                }
            />
            <div className="p-6">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                        <input type="text" placeholder="Buscar funcionário..." style={{ padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', width: '300px' }} />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="button-secondary" style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: '0.4rem', background: 'white' }}>Filtros</button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1rem 0.75rem' }}>Nome do Funcionário</th>
                                    <th style={{ padding: '1rem 0.75rem' }}>Status</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Carregando...</td>
                                    </tr>
                                )}

                                {!loading && funcionarios.length === 0 && (
                                    <tr>
                                        <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Nenhum funcionário cadastrado.</td>
                                    </tr>
                                )}

                                {funcionarios.map(f => (
                                    <tr key={f.id} style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                                        <td style={{ padding: '1rem 0.75rem', fontWeight: 600 }}>
                                            {f.nome}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            <span style={{
                                                padding: '0.35rem 0.6rem',
                                                borderRadius: '6px',
                                                background: f.ativo ? '#c9f7f5' : '#ffe2e5',
                                                color: f.ativo ? '#1bc5bd' : '#f64e60',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                {f.ativo ? 'ATIVO' : 'INATIVO'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                                            <Link
                                                href={`/funcionarios/${f.id}`}
                                                style={{ display: 'inline-block', marginRight: '0.5rem', padding: '0.4rem 0.8rem', background: '#e1f0ff', borderRadius: '4px', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer', textDecoration: 'none' }}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(f.id)}
                                                style={{ padding: '0.4rem 0.8rem', background: '#ffe2e5', borderRadius: '4px', color: '#f64e60', fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
                        <button disabled={true} style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: '0.4rem', background: '#f5f5f5', color: '#aaa', cursor: 'not-allowed' }}>Anterior</button>
                        <button disabled={true} style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: '0.4rem', background: '#f5f5f5', color: '#aaa', cursor: 'not-allowed' }}>Próximo</button>
                    </div>
                </div>
            </div>
        </>
    );
}
