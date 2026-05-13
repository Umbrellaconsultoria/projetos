"use client";

import { Header } from "@/components/layout/Header";
import { unidadesService, Unidade } from "@/services/unidades";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function UnidadesPage() {
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUnidades();
    }, []);

    const fetchUnidades = async () => {
        try {
            const data = await unidadesService.getAll();
            setUnidades(data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar unidades');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Unidades" />
            <div className="p-6">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <Link href="/unidades/nova" style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.4rem',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        + Nova Unidade
                    </Link>
                </div>

                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {unidades.map(unidade => (
                            <div key={unidade.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 className="text-lg font-bold">{unidade.nome}</h3>
                                        {unidade.endereco && <p style={{ color: '#666', fontSize: '0.9rem' }}>{unidade.endereco}</p>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.8rem',
                                            background: unidade.ativo ? '#d1e7dd' : '#f8d7da',
                                            color: unidade.ativo ? '#0f5132' : '#842029'
                                        }}>
                                            {unidade.ativo ? 'Ativa' : 'Inativa'}
                                        </span>
                                        <Link href={`/unidades/${unidade.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                            Editar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {unidades.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                Nenhuma unidade cadastrada além da Matriz (se houver).
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
