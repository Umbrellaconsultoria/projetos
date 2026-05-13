"use client";

import { Header } from "@/components/layout/Header";
import { financeiroService } from "@/services/financeiro";
import { funcionariosService } from "@/services/funcionarios";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function FinanceiroPage() {
    const [status, setStatus] = useState<'ABERTO' | 'FECHADO' | null>(null);
    const [saldo, setSaldo] = useState(0);
    const [detalhes, setDetalhes] = useState<any>(null); // To store full breakdown
    const [produtividade, setProdutividade] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form inputs
    const [valorOperacao, setValorOperacao] = useState('0,00'); // Used for initial/final balance input

    const fetchStatus = async () => {
        try {
            const [caixaData, prodData] = await Promise.all([
                financeiroService.getCaixaStatus(),
                funcionariosService.getProductivity(new Date().toISOString().split('T')[0])
            ]);
            console.log('Caixa Status:', caixaData);
            setStatus(caixaData.status);
            setSaldo(caixaData.saldo_atual_centavos ?? 0);
            setDetalhes(caixaData);
            setProdutividade(prodData);
        } catch (error) {
            console.error(error);
            setStatus('FECHADO');
            setSaldo(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const parseCurrency = (val: string) => {
        // Remove currency symbol, spaces, replace command with dot
        const clean = val.replace(/[R$\s.]/g, '').replace(',', '.');
        return parseFloat(clean);
    };

    const handleAbrirCaixa = async () => {
        let valor = parseCurrency(valorOperacao);
        if (isNaN(valor)) valor = 0;
        const valorCentavos = Math.round(valor * 100);

        try {
            await financeiroService.abrirCaixa(valorCentavos);
            toast.success('Caixa Aberto com sucesso!');
            setValorOperacao('0,00');
            fetchStatus();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Erro ao abrir caixa';
            alert(msg);
        }
    };

    const handleFecharCaixa = async () => {
        let valor = parseCurrency(valorOperacao);
        if (isNaN(valor)) valor = 0;
        const valorCentavos = Math.round(valor * 100);

        try {
            await financeiroService.fecharCaixa(valorCentavos);
            toast.success('Caixa Fechado com sucesso!');
            setValorOperacao('0,00');
            fetchStatus();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Erro ao fechar caixa';
            alert(msg);
        }
    };

    if (loading) return <div className="p-6">Carregando...</div>;

    return (
        <>
            <Header title="Financeiro" />
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* CARD DE STATUS DO CAIXA (DINHEIRO) */}
                    <div className="card" style={{ borderLeft: `5px solid ${status === 'ABERTO' ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
                        <h2 className="text-lg font-bold mb-4" style={{ color: status === 'ABERTO' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            Caixa (Dinheiro) {status}
                        </h2>

                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                            R$ {(saldo / 100).toFixed(2).replace('.', ',')}
                        </div>

                        {/* Se estiver estritamente ABERTO, mostra opção de fechar. Caso contrário (FECHADO, null, undefined), mostra opção de abrir. */}
                        {status === 'ABERTO' ? (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Saldo Final (Fechamento)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        placeholder="0,00"
                                        value={valorOperacao}
                                        onChange={e => setValorOperacao(e.target.value)}
                                        style={{ padding: '0.75rem', borderRadius: '0.4rem', border: '1px solid #ddd', flex: 1 }}
                                    />
                                    <button
                                        onClick={handleFecharCaixa}
                                        style={{ padding: '0.75rem 1.5rem', background: 'var(--color-danger)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Fechar Caixa
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Saldo Inicial (Abertura)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        placeholder="0,00"
                                        value={valorOperacao}
                                        onChange={e => setValorOperacao(e.target.value)}
                                        style={{ padding: '0.75rem', borderRadius: '0.4rem', border: '1px solid #ddd', flex: 1 }}
                                    />
                                    <button
                                        onClick={handleAbrirCaixa}
                                        style={{ padding: '0.75rem 1.5rem', background: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Abrir Caixa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CARD DE DETALHAMENTO DO FATURAMENTO */}
                    <div className="card">
                        <h2 className="text-lg font-bold mb-4">Faturamento do Dia</h2>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.4rem' }}>
                                <span>Pix</span>
                                <strong>R$ {(detalhes?.faturamento_pix_centavos / 100 || 0).toFixed(2).replace('.', ',')}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.4rem' }}>
                                <span>Cartão</span>
                                <strong>R$ {(detalhes?.faturamento_cartao_centavos / 100 || 0).toFixed(2).replace('.', ',')}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.4rem', color: '#666' }}>
                                <span>Outros</span>
                                <strong>R$ {(detalhes?.faturamento_outros_centavos / 100 || 0).toFixed(2).replace('.', ',')}</strong>
                            </div>

                            <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#e1f0ff', borderRadius: '0.4rem', color: '#0050a0' }}>
                                <span style={{ fontWeight: 600 }}>Total Geral</span>
                                <strong style={{ fontSize: '1.2rem' }}>R$ {(detalhes?.faturamento_total_centavos / 100 || 0).toFixed(2).replace('.', ',')}</strong>
                            </div>
                        </div>
                    </div>

                    {/* CARD DE PRODUTIVIDADE */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Produtividade do Dia</h2>
                            <a href="/relatorios/produtividade" className="text-blue-600 text-xs hover:underline">Ver completo</a>
                        </div>

                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {produtividade.length === 0 ? (
                                <div style={{ color: '#999', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
                                    Nenhuma produtividade registrada hoje.
                                </div>
                            ) : (
                                produtividade.map(p => (
                                    <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">{p.nome}</span>
                                            <span className="text-[10px] text-slate-500">{p.quantidade_servicos} serviços</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-blue-600">{p.pontos} pts</span>
                                            <div className="w-16 bg-slate-200 h-1 rounded-full mt-1">
                                                <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${Math.min((p.pontos / 50) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Extrato Recente (Placeholder for now) */}
                    <div className="card">
                        <h2 className="text-lg font-bold mb-4">Movimentações Recentes</h2>
                        <div style={{ color: '#999', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
                            Nenhuma movimentação recente.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
