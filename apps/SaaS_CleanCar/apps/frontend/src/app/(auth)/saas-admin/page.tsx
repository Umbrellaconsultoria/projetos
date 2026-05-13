"use client";

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Header } from '@/components/layout/Header';
import toast from 'react-hot-toast';

interface Tenant {
    id: string;
    nome_fantasia: string;
    cnpj: string;
    assinatura: any;
    _count: { unidades: number };
}

interface Fatura {
    id: string;
    mes_referencia: number;
    ano_referencia: number;
    valor_total: number;
    data_vencimento: string;
    data_pagamento: string;
    status: string;
    url_comprovante: string;
    observacoes: string;
    assinatura: { tenant: { nome_fantasia: string } };
}

export default function SaisAdminPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [faturas, setFaturas] = useState<Fatura[]>([]);
    const [tab, setTab] = useState<'tenants' | 'faturas'>('tenants');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const resTenants = await api.get('/saas/tenants');
            setTenants(resTenants.data);
            const resFaturas = await api.get('/saas/faturas');
            setFaturas(resFaturas.data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar dados do SaaS');
        }
    };

    const handleAprovar = async (id: string) => {
        try {
            await api.post(`/saas/faturas/${id}/aprovar`);
            toast.success('Fatura aprovada e assinatura ativada!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao aprovar a fatura.');
        }
    };

    const handleRejeitar = async (id: string) => {
        try {
            await api.post(`/saas/faturas/${id}/rejeitar`);
            toast.success('Fatura rejeitada e devolvida para o cliente!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao rejeitar a fatura.');
        }
    };

    const handleChangeStatusAssinatura = async (id: string, novoStatus: string) => {
        try {
            await api.post(`/saas/assinaturas/${id}/status`, { status: novoStatus });
            toast.success('Status da Assinatura alterado com sucesso!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao alterar status da assinatura.');
        }
    };

    const handleChangeStatusFatura = async (id: string, novoStatus: string) => {
        try {
            await api.post(`/saas/faturas/${id}/status`, { status: novoStatus });
            toast.success('Status da Fatura alterado!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao alterar status da fatura.');
        }
    };

    return (
        <div className="p-6">
            <Header title="Painel de Gestão SaaS" />
            <div className="mt-6">
                <div className="card">
                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #ebedf3', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        <button onClick={() => setTab('tenants')} style={tab !== 'tenants' ? { padding: '0.5rem 1rem', background: 'transparent', color: '#a2a3b7', border: 'none', cursor: 'pointer', fontWeight: 600 } : { padding: '0.5rem 1rem', background: '#eef0f8', color: '#3699ff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Clientes (Tenants)</button>
                        <button onClick={() => setTab('faturas')} style={tab !== 'faturas' ? { padding: '0.5rem 1rem', background: 'transparent', color: '#a2a3b7', border: 'none', cursor: 'pointer', fontWeight: 600 } : { padding: '0.5rem 1rem', background: '#eef0f8', color: '#3699ff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Faturas e Pagamentos</button>
                    </div>

                    {tab === 'tenants' && (
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                    <th>Cliente</th>
                                    <th>Unidades</th>
                                    <th>Status Assinatura</th>
                                    <th>Desde</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '0.5rem 0' }}>{t.nome_fantasia} <br /><small>{t.cnpj}</small></td>
                                        <td>{t._count.unidades}</td>
                                        <td>
                                            <select
                                                value={t.assinatura?.status || 'TESTE_GRATIS'}
                                                onChange={(e) => handleChangeStatusAssinatura(t.assinatura?.id, e.target.value)}
                                                style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ebedf3', backgroundColor: t.assinatura?.status === 'ATIVA' ? '#e8fff3' : '#fff5f8', color: t.assinatura?.status === 'ATIVA' ? '#1bc5bd' : '#f64e60', fontWeight: 'bold' }}
                                            >
                                                <option value="TESTE_GRATIS">TESTE_GRATIS</option>
                                                <option value="ATIVA">ATIVA</option>
                                                <option value="INADIMPLENTE">INADIMPLENTE</option>
                                                <option value="CANCELADA">CANCELADA</option>
                                            </select>
                                        </td>
                                        <td>{new Date(t.assinatura?.data_inicio).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === 'faturas' && (
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                    <th>Cliente</th>
                                    <th>Mês/Ano</th>
                                    <th>Valor</th>
                                    <th>Vencimento</th>
                                    <th>Status</th>
                                    <th>Comprovante</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faturas.map(f => (
                                    <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '0.5rem 0' }}>{f.assinatura?.tenant?.nome_fantasia}</td>
                                        <td>{f.mes_referencia}/{f.ano_referencia}</td>
                                        <td>{(f.valor_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td>{new Date(f.data_vencimento).toLocaleDateString()}</td>
                                        <td>
                                            <select
                                                value={f.status}
                                                onChange={(e) => handleChangeStatusFatura(f.id, e.target.value)}
                                                style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ebedf3', backgroundColor: f.status === 'PAGA' ? '#e8fff3' : (f.status === 'EM_ANALISE' ? '#fff4de' : '#fff5f8'), fontWeight: 'bold', color: '#3f4254' }}
                                            >
                                                <option value="PENDENTE">PENDENTE</option>
                                                <option value="EM_ANALISE">EM_ANALISE</option>
                                                <option value="PAGA">PAGA</option>
                                                <option value="CANCELADA">CANCELADA</option>
                                            </select>
                                        </td>
                                        <td>
                                            {f.url_comprovante ? (
                                                <a href={`http://localhost:3333${f.url_comprovante}`} target="_blank" rel="noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                                                    Ver Comprovante
                                                </a>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            {f.status === 'EM_ANALISE' && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => handleAprovar(f.id)} style={{ padding: '0.3rem 0.6rem', background: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✓ Aprovar</button>
                                                    <button onClick={() => handleRejeitar(f.id)} style={{ padding: '0.3rem 0.6rem', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✗ Rejeitar</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
