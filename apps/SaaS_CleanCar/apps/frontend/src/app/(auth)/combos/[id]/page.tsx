"use client";

import { Header } from "@/components/layout/Header";
import { combosService } from "@/services/combos";
import { servicosService, Servico } from "@/services/servicos";
import { PorteLabel, PorteVeiculo } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditarComboPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [nome, setNome] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([]);
    const [selectedServicos, setSelectedServicos] = useState<string[]>([]);

    const [precos, setPrecos] = useState<{ porte: PorteVeiculo; valor: string }[]>([
        { porte: PorteVeiculo.HATCH_SEDAN, valor: '0,00' },
        { porte: PorteVeiculo.MEDIO, valor: '0,00' },
        { porte: PorteVeiculo.GRANDE, valor: '0,00' },
    ]);

    const formatCurrency = (cents: number) => {
        return (cents / 100).toFixed(2).replace('.', ',');
    };

    const parseCurrency = (val: string) => {
        const clean = val.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(clean) || 0;
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [servicesData, comboData] = await Promise.all([
                    servicosService.getAll(),
                    combosService.getById(id)
                ]);

                setServicosDisponiveis(servicesData);
                setNome(comboData.nome);
                setAtivo(comboData.ativo);
                setSelectedServicos(comboData.itens.map(i => i.id_servico));

                // Map fetched prices to state, keeping the 3 default portes if any missing
                setPrecos(prevPrecos => prevPrecos.map(p => {
                    const fetchedPrice = comboData.precos.find(fp => fp.porte === p.porte);
                    return {
                        ...p,
                        valor: fetchedPrice ? formatCurrency(fetchedPrice.valor_centavos) : '0,00'
                    };
                }));

            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar dados do combo');
                router.push('/combos');
            } finally {
                setLoadingData(false);
            }
        };

        if (id) {
            loadInitialData();
        }
    }, [id, router]);

    const handlePriceChange = (porte: PorteVeiculo, value: string) => {
        setPrecos(prev => prev.map(p => p.porte === porte ? { ...p, valor: value } : p));
    };

    const toggleService = (id: string) => {
        setSelectedServicos(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedServicos.length === 0) {
            toast.error('Selecione pelo menos um serviço para o combo.');
            return;
        }

        setLoading(true);

        try {
            const formattedPrecos = precos.map(p => ({
                porte: p.porte,
                valor_centavos: Math.round(parseCurrency(p.valor) * 100)
            }));

            await combosService.update(id, {
                nome,
                ativo,
                itens_ids: selectedServicos,
                precos: formattedPrecos
            });

            toast.success('Combo atualizado com sucesso!');
            router.push('/combos');
        } catch (error: any) {
            console.error(error);
            toast.error('Erro ao atualizar combo: ' + (error.response?.data?.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <>
            <Header title={`Editar Combo`} />
            <div className="p-6">
                <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                            <label className="block mb-2 font-bold">Nome do Combo</label>
                            <input
                                type="text"
                                required
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                className="w-full p-2 border rounded"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                                placeholder="Ex: Lavagem Completa + Cera"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-bold">Status</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        checked={ativo}
                                        onChange={() => setAtivo(true)}
                                    />
                                    <span>Ativo</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        checked={!ativo}
                                        onChange={() => setAtivo(false)}
                                    />
                                    <span>Inativo</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold mb-3 border-b pb-2">Serviços Incluídos</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                            {servicosDisponiveis.map(servico => (
                                <label key={servico.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: '1px solid #eee', borderRadius: '0.25rem', cursor: 'pointer', background: selectedServicos.includes(servico.id) ? '#e1f0ff' : 'white' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedServicos.includes(servico.id)}
                                        onChange={() => toggleService(servico.id)}
                                    />
                                    <span>{servico.nome}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold mb-3 border-b pb-2">Preços do Combo por Porte</h3>
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
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
