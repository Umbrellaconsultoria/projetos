"use client";

import { Header } from "@/components/layout/Header";
import { funcionariosService } from "@/services/funcionarios";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function EditarFuncionarioPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [nome, setNome] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await funcionariosService.getById(id);
                setNome(data.nome);
                setAtivo(data.ativo);
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar dados do funcionário.');
                router.push('/funcionarios');
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
            await funcionariosService.update(id, { nome, ativo });
            toast.success('Funcionário atualizado com sucesso!');
            router.push('/funcionarios');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar funcionário.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <>
            <Header title="Editar Funcionário" />
            <div className="p-6">
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Nome Completo *</label>
                            <input
                                required
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                placeholder="Ex: João da Silva"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '0.4rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Status *</label>
                            <select
                                value={ativo ? 'true' : 'false'}
                                onChange={e => setAtivo(e.target.value === 'true')}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '0.4rem'
                                }}
                            >
                                <option value="true">Ativo</option>
                                <option value="false">Inativo</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#f5f5f5',
                                    border: '1px solid #ddd',
                                    borderRadius: '0.4rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !nome.trim()}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.4rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    opacity: loading || !nome.trim() ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
