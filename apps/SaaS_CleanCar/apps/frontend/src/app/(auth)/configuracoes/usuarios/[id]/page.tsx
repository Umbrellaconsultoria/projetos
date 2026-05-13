"use client";

import { Header } from "@/components/layout/Header";
import { rbacService, Papel } from "@/services/rbac";
import { usuariosService } from "@/services/usuarios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function EditarUsuario() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [papeis, setPapeis] = useState<Papel[]>([]);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '', // optional
        papelId: ''
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [papeisData, usuarioData] = await Promise.all([
                    rbacService.getAllRoles(),
                    usuariosService.getById(id)
                ]);

                setPapeis(papeisData);
                setFormData({
                    nome: usuarioData.nome,
                    email: usuarioData.email,
                    senha: '', // leave empty, only fill if changing
                    papelId: usuarioData.papeis?.length > 0 ? usuarioData.papeis[0].papel.id : ''
                });
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar dados do usuário.');
                router.push('/configuracoes/usuarios');
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
            const updateData: any = {
                nome: formData.nome,
                email: formData.email,
                papeisIds: formData.papelId ? [formData.papelId] : []
            };

            if (formData.senha) {
                updateData.senha = formData.senha;
            }

            await usuariosService.update(id, updateData);
            toast.success('Usuário atualizado com sucesso!');
            router.push('/configuracoes/usuarios');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar usuário.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="p-6">Carregando...</div>;
    }

    return (
        <>
            <Header title="Editar Usuário" />
            <div className="p-6">
                <div className="card" style={{ maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Nome</label>
                            <input
                                required
                                value={formData.nome}
                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Email</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Nova Senha (deixe em branco se não quiser alterar)</label>
                            <input
                                type="password"
                                minLength={6}
                                value={formData.senha}
                                onChange={e => setFormData({ ...formData, senha: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Perfil de Acesso</label>
                            <select
                                required
                                value={formData.papelId}
                                onChange={e => setFormData({ ...formData, papelId: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            >
                                <option value="">-- Selecione --</option>
                                {papeis.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: '#eee',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '0.4rem',
                                    fontWeight: 600,
                                    marginRight: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '0.75rem 2rem',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.4rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {loading ? 'Salvando...' : 'Atualizar Usuário'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
