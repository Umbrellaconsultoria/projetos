"use client";

import { Header } from "@/components/layout/Header";
import { unidadesService } from "@/services/unidades";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from 'react-hot-toast';

export default function NovaUnidadePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await unidadesService.create({
                nome,
                endereco
            });

            toast.success('Unidade criada com sucesso!');
            router.push('/unidades');
        } catch (error: any) {
            console.error(error);
            toast.error('Erro ao criar unidade: ' + (error.response?.data?.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Nova Unidade" />
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
                            placeholder="Ex: Filial Centro"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-bold">Endereço</label>
                        <textarea
                            value={endereco}
                            onChange={e => setEndereco(e.target.value)}
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            rows={3}
                            placeholder="Ex: Av. Principal, 1000"
                        />
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
                            {loading ? 'Salvando...' : 'Criar Unidade'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
