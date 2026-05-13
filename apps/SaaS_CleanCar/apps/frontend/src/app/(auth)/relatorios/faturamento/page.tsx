'use client';

import { Header } from "@/components/layout/Header";
import { financeiroService } from "@/services/financeiro";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FaturamentoPage() {
    const [detalhes, setDetalhes] = useState<any>(null);
    const [graficoDados, setGraficoDados] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter state: default to last 7 days including today
    const [dataInicio, setDataInicio] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        return d.toISOString().split('T')[0];
    });
    const [dataFim, setDataFim] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [caixaData, chartData] = await Promise.all([
                financeiroService.getCaixaStatus(),
                financeiroService.getFaturamentoPeriodo(dataInicio, dataFim)
            ]);
            setDetalhes(caixaData);

            // Format chart data for Brazilian locale dates
            const formattedChartData = chartData.map((d: any) => {
                const [year, month, day] = d.date.split('-');
                return {
                    ...d,
                    dateFormatted: `${day}/${month}`
                };
            });
            setGraficoDados(formattedChartData);
        } catch (error) {
            console.error('Erro ao buscar faturamento:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dataInicio, dataFim]);

    if (loading && !detalhes) return <div className="p-6">Carregando relatório de faturamento...</div>;

    const total = (detalhes?.faturamento_total_centavos || 0) / 100;
    const pix = (detalhes?.faturamento_pix_centavos || 0) / 100;
    const cartao = (detalhes?.faturamento_cartao_centavos || 0) / 100;
    const outros = (detalhes?.faturamento_outros_centavos || 0) / 100;

    return (
        <>
            <Header title="Relatório de Faturamento" />
            <div className="p-6">

                {/* Resumo de Hoje */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Resumo de Hoje</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Entradas diárias (Fluxo de Caixa atual)
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                        {/* Total Card */}
                        <div style={{ background: 'var(--color-primary)', color: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.9, marginBottom: '0.5rem' }}>Total Geral (Hoje)</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>R$ {total.toFixed(2).replace('.', ',')}</h2>
                        </div>

                        {/* PIX Card */}
                        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #eee' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Recebido via PIX</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>R$ {pix.toFixed(2).replace('.', ',')}</h2>
                        </div>

                        {/* Cartão Card */}
                        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #eee' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Recebido via Cartão</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>R$ {cartao.toFixed(2).replace('.', ',')}</h2>
                        </div>

                        {/* Outros Card */}
                        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #eee' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Outras Formas (Dinheiro)</p>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>R$ {outros.toFixed(2).replace('.', ',')}</h2>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', background: '#f8f9fa', border: '1px solid #eee' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Data Inicial</label>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={e => setDataInicio(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.4rem', background: 'white' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Data Final</label>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={e => setDataFim(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.4rem', background: 'white' }}
                        />
                    </div>
                </div>

                {/* Gráfico de Faturamento por Período */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>Evolução do Faturamento por Forma de Pagamento</h2>

                    <div style={{ width: '100%', height: '400px' }}>
                        {loading ? (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Atualizando gráfico...</div>
                        ) : graficoDados.length === 0 ? (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Nenhum dado financeiro no período selecionado.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={graficoDados}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                                    <YAxis
                                        tickFormatter={(value) => `R$ ${value}`}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#888', fontSize: 12 }}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        formatter={(value: any) => [`R$ ${Number(value).toFixed(2).replace('.', ',')}`, '']}
                                        labelStyle={{ color: '#333', fontWeight: 'bold', marginBottom: '5px' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="PIX" name="PIX" stackId="a" fill="var(--color-success)" radius={[0, 0, 4, 4]} barSize={40} />
                                    <Bar dataKey="CARTAO_DEBITO" name="Cartão de Débito" stackId="a" fill="#3699ff" />
                                    <Bar dataKey="CARTAO_CREDITO" name="Cartão de Crédito" stackId="a" fill="var(--color-warning)" />
                                    <Bar dataKey="DINHEIRO" name="Dinheiro" stackId="a" fill="#8950fc" />
                                    <Bar dataKey="OUTROS" name="Outras Formas" stackId="a" fill="#d9d9d9" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Tabela de Detalhamento Diário */}
                <div className="card">
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>Detalhamento Diário</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '1rem 0.75rem' }}>Data</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Dinheiro</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>PIX</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Cartão Crédito</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Cartão Débito</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Outros</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 'bold' }}>Total do Dia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Carregando dados...</td>
                                    </tr>
                                )}

                                {!loading && graficoDados.length === 0 && (
                                    <tr>
                                        <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Nenhum faturamento encontrado neste período.</td>
                                    </tr>
                                )}

                                {!loading && graficoDados.map((dia, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                                        <td style={{ padding: '1rem 0.75rem', fontWeight: 500 }}>
                                            {new Date(dia.date + 'T12:00:00').toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                                            R$ {dia.DINHEIRO.toFixed(2).replace('.', ',')}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                                            R$ {dia.PIX.toFixed(2).replace('.', ',')}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                                            R$ {dia.CARTAO_CREDITO.toFixed(2).replace('.', ',')}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                                            R$ {dia.CARTAO_DEBITO.toFixed(2).replace('.', ',')}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                                            R$ {dia.OUTROS.toFixed(2).replace('.', ',')}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-success)' }}>
                                            R$ {dia.TOTAL.toFixed(2).replace('.', ',')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}
