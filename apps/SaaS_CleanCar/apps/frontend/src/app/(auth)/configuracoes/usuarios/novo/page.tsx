"use client";

import { Header } from "@/components/layout/Header";
import { rbacService, Papel } from "@/services/rbac";
import { usuariosService } from "@/services/usuarios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function NovoUsuario() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [papeis, setPapeis] = useState<Papel[]>([]);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        papelId: ''
    });

    useEffect(() => {
        rbacService.getAllRoles().then(setPapeis).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await usuariosService.create({
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
                papeisIds: formData.papelId ? [formData.papelId] : []
            });
            toast.success('Usuário criado com sucesso!');
            router.push('/configuracoes/usuarios');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao criar usuário.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Novo Usuário" />
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
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Senha</label>
                            <input
                                required
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
                                {loading ? 'Salvando...' : 'Criar Usuário'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
