"use client";

import { Header } from "@/components/layout/Header";
import { clientesService } from "@/services/clientes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from 'react-hot-toast';

export default function NovoCliente() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cliente = await clientesService.create({ nome, telefone });
            router.push(`/clientes/${cliente.id}`); // Redirect to edit page to add vehicles
        } catch (error) {
            toast.error('Erro ao criar cliente');
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Novo Cliente" />
            <div className="p-6">
                <div className="card" style={{ maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nome Completo *</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)' }}
                                placeholder="Ex: João Silva"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Telefone</label>
                            <input
                                type="text"
                                value={telefone}
                                onChange={e => setTelefone(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)' }}
                                placeholder="Ex: (11) 99999-9999"
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', background: 'white', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '0.4rem', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Salvando...' : 'Salvar e Adicionar Veículos'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
