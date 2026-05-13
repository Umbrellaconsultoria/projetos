"use client";

import { Header } from "@/components/layout/Header";
import { combosService, Combo } from "@/services/combos";
import { PorteLabel } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function CombosPage() {
    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCombos();
    }, []);

    const fetchCombos = async () => {
        try {
            const data = await combosService.getAll();
            setCombos(data);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar combos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Combos" />
            <div className="p-6">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <Link href="/combos/novo" style={{
                        background: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.4rem',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        + Novo Combo
                    </Link>
                </div>

                {loading ? (
                    <div>Carregando...</div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {combos.map(combo => (
                            <div key={combo.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 className="text-lg font-bold">{combo.nome}</h3>
                                        <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                            Itens: {combo.itens.map(i => i.servico?.nome).join(', ')}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.8rem',
                                            background: combo.ativo ? '#d1e7dd' : '#f8d7da',
                                            color: combo.ativo ? '#0f5132' : '#842029'
                                        }}>
                                            {combo.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                        <Link href={`/combos/${combo.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                            Editar
                                        </Link>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem' }}>Tabela de Preços</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                        {combo.precos.map(preco => (
                                            <div key={preco.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#f8f9fa', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.9rem' }}>
                                                <span>{PorteLabel[preco.porte]}</span>
                                                <strong>R$ {(preco.valor_centavos / 100).toFixed(2)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {combos.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                Nenhum combo cadastrado.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
