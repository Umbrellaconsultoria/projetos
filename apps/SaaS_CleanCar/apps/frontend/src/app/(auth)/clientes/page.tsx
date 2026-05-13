"use client";

import { Header } from "@/components/layout/Header";
import { clientesService } from "@/services/clientes";
import { Cliente } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function ClientesList() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClientes = async () => {
        try {
            const data = await clientesService.getAll();
            setClientes(data);
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await clientesService.delete(id);
                fetchClientes();
            } catch (error) {
                toast.error('Erro ao excluir cliente');
            }
        }
    };

    return (
        <>
            <Header
                title="Clientes"
                rightAction={
                    <Link href="/clientes/novo" style={{
                        backgroundColor: 'var(--color-success)',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.4rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span>+</span> Novo Cliente
                    </Link>
                }
            />
            <div className="p-6">
                <div className="card">
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '1rem 0.75rem' }}>Nome</th>
                                    <th style={{ padding: '1rem 0.75rem' }}>Telefone</th>
                                    <th style={{ padding: '1rem 0.75rem' }}>Veículos</th>
                                    <th style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</td></tr>
                                ) : clientes.length === 0 ? (
                                    <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Nenhum cliente encontrado.</td></tr>
                                ) : (
                                    clientes.map(cliente => (
                                        <tr key={cliente.id} style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                                            <td style={{ padding: '1rem 0.75rem', fontWeight: 600 }}>{cliente.nome}</td>
                                            <td style={{ padding: '1rem 0.75rem' }}>{cliente.telefone || '-'}</td>
                                            <td style={{ padding: '1rem 0.75rem' }}>
                                                {cliente.veiculos?.length || 0}
                                            </td>
                                            <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                                                <Link href={`/clientes/${cliente.id}`} style={{ marginRight: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                                    Editar
                                                </Link>
                                                <button onClick={() => handleDelete(cliente.id)} style={{ border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontWeight: 600 }}>
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
