'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { funcionariosService } from '@/services/funcionarios';
import toast from 'react-hot-toast';

export default function NovoFuncionarioPage() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await funcionariosService.create({ nome });
            router.push('/funcionarios');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao salvar funcionário');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Header title="Novo Funcionário" />
            <div className="p-6">
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                        Dados Cadastrais
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                                Nome Completo <span style={{ color: 'var(--color-danger)' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.4rem',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '0.95rem'
                                }}
                                placeholder="Digite o nome do funcionário"
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    background: 'white',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '0.4rem',
                                    color: 'var(--color-text-primary)',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    background: 'var(--color-primary)',
                                    border: 'none',
                                    borderRadius: '0.4rem',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    opacity: saving ? 0.7 : 1
                                }}
                            >
                                {saving ? "Salvando..." : "Salvar Funcionário"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
