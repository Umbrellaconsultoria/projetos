'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { funcionariosService } from '@/services/funcionarios';

interface ProductivityItem {
    id: string;
    nome: string;
    pontos: number;
    quantidade_servicos: number;
}

export default function ProdutividadePage() {
    const [report, setReport] = useState<ProductivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const data = await funcionariosService.getProductivity(selectedDate);
            setReport(data);
        } catch (error) {
            console.error('Erro ao buscar relatório de produtividade:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [selectedDate]);

    return (
        <>
            <Header title="Relatório de Produtividade" />

            <div className="p-6">
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Acompanhamento Diário</h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Pontos e serviços realizados por funcionário</p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Data Base:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', outline: 'none' }}
                            />
                            <button
                                onClick={fetchReport}
                                style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                            Carregando dados de produtividade...
                        </div>
                    ) : report.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            Nenhum serviço ou produtividade registrada para esta data.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {report.map(item => (
                                <div key={item.id} style={{ background: '#f8f9fa', border: '1px solid #eee', padding: '1.5rem', borderRadius: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{item.nome}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item.quantidade_servicos} serviços concluídos</p>
                                        </div>
                                        <div style={{ background: '#e1f0ff', color: '#0050a0', padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                            {item.pontos} pts
                                        </div>
                                    </div>

                                    <div style={{ width: '100%', background: '#e2e8f0', height: '0.5rem', borderRadius: '1rem', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                background: 'var(--color-primary)',
                                                height: '100%',
                                                width: `${Math.min((item.pontos / 50) * 100, 100)}%`,
                                                transition: 'width 0.5s ease-in-out'
                                            }}
                                        ></div>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>Meta diária sugerida: 50 pts</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card" style={{ background: '#f8f9fa', border: '1px solid #eee' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Resumo Consolidado</h2>
                    <div style={{ display: 'flex', gap: '3rem' }}>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Total de Pontos Produzidos</p>
                            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                                {report.reduce((sum, item) => sum + item.pontos, 0)}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Total de Serviços Executados</p>
                            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                                {report.reduce((sum, item) => sum + item.quantidade_servicos, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
