"use client";

import { Header } from "@/components/layout/Header";
import { servicosService } from "@/services/servicos";
import { PorteLabel, PorteVeiculo } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from 'react-hot-toast';

export default function NovoServicoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [pontos, setPontos] = useState('0');

    // Initial prices state for all vehicle sizes
    const [precos, setPrecos] = useState<{ porte: PorteVeiculo; valor: string }[]>([
        { porte: PorteVeiculo.HATCH_SEDAN, valor: '0,00' },
        { porte: PorteVeiculo.MEDIO, valor: '0,00' },
        { porte: PorteVeiculo.GRANDE, valor: '0,00' },
    ]);

    const handlePriceChange = (porte: PorteVeiculo, value: string) => {
        setPrecos(prev => prev.map(p => p.porte === porte ? { ...p, valor: value } : p));
    };

    const parseCurrency = (val: string) => {
        const clean = val.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(clean) || 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formattedPrecos = precos.map(p => ({
                porte: p.porte,
                valor_centavos: Math.round(parseCurrency(p.valor) * 100)
            }));

            await servicosService.create({
                nome,
                descricao,
                pontos: parseInt(pontos) || 0,
                precos: formattedPrecos
            });

            toast.success('Serviço criado com sucesso!');
            router.push('/servicos');
        } catch (error: any) {
            console.error(error);
            toast.error('Erro ao criar serviço: ' + (error.response?.data?.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Novo Serviço" />
            <div className="p-6">
                <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold">Nome do Serviço</label>
                        <input
                            type="text"
                            required
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            placeholder="Ex: Lavagem Simples"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-bold">Descrição</label>
                        <textarea
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            rows={3}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-bold">Pontos de Produtividade</label>
                        <input
                            type="number"
                            value={pontos}
                            onChange={e => setPontos(e.target.value)}
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            min="0"
                        />
                        <p className="text-xs text-slate-500 mt-1">Pontuação que o funcionário receberá ao realizar este serviço.</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold mb-3 border-b pb-2">Preços por Porte</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {precos.map(p => (
                                <div key={p.porte} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <label style={{ flex: 1 }}>{PorteLabel[p.porte]}</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '0.5rem', color: '#666' }}>R$</span>
                                        <input
                                            type="text"
                                            value={p.valor}
                                            onChange={e => handlePriceChange(p.porte, e.target.value)}
                                            style={{ width: '100px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.4rem', textAlign: 'right' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                            style={{ padding: '0.75rem 1.5rem', background: '#eee', border: 'none', borderRadius: '0.4rem', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
                            style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                            {loading ? 'Salvando...' : 'Criar Serviço'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
