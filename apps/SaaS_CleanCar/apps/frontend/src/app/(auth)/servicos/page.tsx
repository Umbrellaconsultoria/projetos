"use client";

import { Header } from "@/components/layout/Header";
import { servicosService, Servico } from "@/services/servicos";
import { PorteLabel } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function ServicosPage() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServicos();
    }, []);

    const fetchServicos = async () => {
        try {
            const data = await servicosService.getAll();
            setServicos(data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar serviços');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Serviços" />
            <div className="p-6">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <Link href="/servicos/novo" style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.4rem',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        + Novo Serviço
                    </Link>
                </div>

                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {servicos.map(servico => (
                            <div key={servico.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 className="text-lg font-bold">{servico.nome}</h3>
                                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{servico.descricao || 'Sem descrição'}</p>
                                    </div>
                                    <Link href={`/servicos/${servico.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                        Editar
                                    </Link>
                                </div>

                                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem' }}>Tabela de Preços</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                        {servico.precos.map(preco => (
                                            <div key={preco.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#f8f9fa', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.9rem' }}>
                                                <span>{PorteLabel[preco.porte]}</span>
                                                <strong>R$ {(preco.valor_centavos / 100).toFixed(2)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {servicos.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                Nenhum serviço cadastrado.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
