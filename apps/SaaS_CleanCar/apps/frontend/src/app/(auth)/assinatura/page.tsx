"use client";

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Header } from '@/components/layout/Header';
import toast from 'react-hot-toast';

interface Fatura {
    id: string;
    mes_referencia: number;
    ANO_referencia: number;
    valor_total: number;
    data_vencimento: string;
    data_pagamento: string;
    status: string;
    url_comprovante: string;
}

export default function AssinaturaPage() {
    const [faturas, setFaturas] = useState<Fatura[]>([]);
    const [fileToUpload, setFileToUpload] = useState<{ [key: string]: File | null }>({});

    useEffect(() => {
        fetchFaturas();
    }, []);

    const fetchFaturas = async () => {
        try {
            const res = await api.get('/faturas');
            setFaturas(res.data);
        } catch (error) {
            toast.error('Erro ao buscar faturas');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, idFatura: string) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileToUpload({ ...fileToUpload, [idFatura]: e.target.files[0] });
        }
    };

    const handleUploadComprovante = async (idFatura: string) => {
        const file = fileToUpload[idFatura];
        if (!file) {
            toast.error('Selecione um arquivo de comprovante primeiro.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post(`/faturas/${idFatura}/comprovante`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Comprovante enviado com sucesso! Está em análise.');
            fetchFaturas();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao enviar comprovante');
        }
    };

    return (
        <div className="page-container">
            <Header title="Minha Assinatura" />
            <div className="page-content">
                <main className="main-content">
                    <div className="card mb-6 mb-4">
                        <h2 className="text-xl font-bold mb-4">Faturas e Pagamentos</h2>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            Acompanhe os pagamentos da sua assinatura SaaS, envie seus comprovantes de PIX em faturas abertas e veja o histórico.
                        </p>

                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                    <th>Referência</th>
                                    <th>Valor</th>
                                    <th>Vencimento</th>
                                    <th>Status</th>
                                    <th>Comprovante PIX</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faturas.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                                            Nenhuma fatura encontrada.
                                        </td>
                                    </tr>
                                )}
                                {faturas.map(f => (
                                    <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '0.8rem 0' }}>{f.mes_referencia}/{f.ANO_referencia || f.mes_referencia}</td>
                                        <td>{(f.valor_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td>{new Date(f.data_vencimento).toLocaleDateString()}</td>
                                        <td>
                                            <span style={{ fontWeight: 'bold', color: f.status === 'PAGA' ? 'green' : (f.status === 'EM_ANALISE' ? 'orange' : 'red') }}>
                                                {f.status}
                                            </span>
                                        </td>
                                        <td>
                                            {f.status === 'PENDENTE' && (
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <input
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        onChange={(e) => handleFileChange(e, f.id)}
                                                        style={{ maxWidth: '150px', fontSize: '12px' }}
                                                    />
                                                    <button
                                                        onClick={() => handleUploadComprovante(f.id)}
                                                        className="btn-primary"
                                                        style={{ padding: '0.2rem 0.5rem', fontSize: '12px' }}
                                                    >
                                                        Enviar
                                                    </button>
                                                </div>
                                            )}
                                            {f.status !== 'PENDENTE' && (
                                                <span>{f.status === 'PAGA' ? 'Processado' : 'Em Análise'}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
