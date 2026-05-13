"use client";

import { Header } from "@/components/layout/Header";
import { osService, OrdemServico } from "@/services/os";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OsList() {
    const [orders, setOrders] = useState<OrdemServico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        osService.getAll()
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ABERTA': return { bg: '#e1f0ff', color: '#3699ff' };
            case 'FINALIZADA': return { bg: '#c9f7f5', color: '#1bc5bd' };
            case 'CANCELADA': return { bg: '#ffe2e5', color: '#f64e60' };
            default: return { bg: '#fff4de', color: '#ffa800' };
        }
    };

    return (
        <>
            <Header
                title="Ordens de Serviço"
                rightAction={
                    <Link href="/os/nova" style={{
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
                        <span>+</span> Nova OS
                    </Link>
                }
            />
            <div className="p-6">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                        <input type="text" placeholder="Buscar por cliente ou placa..." style={{ padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', width: '300px' }} />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="button-secondary" style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: '0.4rem', background: 'white' }}>Filtros</button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1rem 0.75rem' }}>Data</th>
                                    <th style={{ padding: '1rem 0.75rem' }}>Cliente</th>
                                    <th style={{ padding: '1rem 0.75rem' }}>Veículo</th>
                                    <th style={{ padding: '1rem 0.75rem' }}>Status</th>
                                    <th style={{ padding: '1rem 0.75rem' }}>Total</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Carregando...</td>
                                    </tr>
                                )}

                                {!loading && orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Nenhuma OS encontrada.</td>
                                    </tr>
                                )}

                                {orders.map(os => {
                                    const statusStyle = getStatusColor(os.status);
                                    return (
                                        <tr key={os.id} style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                                            <td style={{ padding: '1rem 0.75rem' }}>
                                                {new Date(os.data).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem 0.75rem' }}>
                                                <div style={{ fontWeight: 600 }}>{os.cliente.nome}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{os.cliente.telefone || '-'}</div>
                                            </td>
                                            <td style={{ padding: '1rem 0.75rem' }}>
                                                {os.veiculo.modelo} <span style={{ color: 'var(--color-text-secondary)' }}>{os.veiculo.placa}</span>
                                            </td>
                                            <td style={{ padding: '1rem 0.75rem' }}>
                                                <span style={{
                                                    padding: '0.35rem 0.6rem',
                                                    borderRadius: '6px',
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600
                                                }}>
                                                    {os.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 0.75rem', fontWeight: 600 }}>
                                                R$ {(os.total_centavos / 100).toFixed(2)}
                                            </td>
                                            <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                                                <Link href={`/os/${os.id}`} style={{ padding: '0.4rem 0.8rem', background: '#f3f6f9', borderRadius: '4px', color: '#7e8299', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                                                    Detalhes
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
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
    )
}
