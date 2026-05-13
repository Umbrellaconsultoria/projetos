"use client";

import { Header } from "@/components/layout/Header";
import { unidadesService } from "@/services/unidades";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditarUnidadePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [ativo, setAtivo] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const unidadeData = await unidadesService.getById(id);
                setNome(unidadeData.nome);
                setEndereco(unidadeData.endereco || '');
                setAtivo(unidadeData.ativo);
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar dados da unidade');
                router.push('/unidades');
            } finally {
                setLoadingData(false);
            }
        };

        if (id) {
            loadInitialData();
        }
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await unidadesService.update(id, { nome, endereco, ativo });
            toast.success('Unidade atualizada com sucesso!');
            router.push('/unidades');
        } catch (error: any) {
            console.error(error);
            toast.error('Erro ao atualizar unidade: ' + (error.response?.data?.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <>
            <Header title="Editar Unidade" />
            <div className="p-6">
                <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold">Nome da Unidade</label>
                        <input
                            type="text"
                            required
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            placeholder="Ex: Matriz Centro"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold">Endereço (opcional)</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={e => setEndereco(e.target.value)}
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            placeholder="Ex: Rua das Flores, 123"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-bold">Status</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
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
