"use client";

import { Header } from "@/components/layout/Header";
import { osService } from "@/services/os";
import { financeiroService } from "@/services/financeiro";
import { PorteLabel, PorteVeiculo } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import toast from 'react-hot-toast';

export default function DetalhesOS() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [os, setOs] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('DINHEIRO');
    const [processingPayment, setProcessingPayment] = useState(false);

    const fetchOS = async () => {
        try {
            const data = await osService.getById(id);
            console.log('OS Data:', data);
            setOs(data);
        } catch (error) {
            console.error(error);
            toast.error('OS não encontrada');
            router.push('/os');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchOS();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        try {
            await api.patch(`/ordens-servico/${id}/status`, { status: newStatus });
            fetchOS();
        } catch (error) {
            toast.error('Erro ao atualizar status');
        }
    };

    const handlePayment = async () => {
        if (!os) return;
        setProcessingPayment(true);
        try {
            await financeiroService.registrarPagamento({
                id_ordem_servico: os.id,
                forma_pagamento: paymentMethod,
                valor_centavos: os.total_centavos,
                id_unidade: os.id_unidade
            });
            toast.success('Pagamento registrado com sucesso!');
            setShowPaymentModal(false);
            fetchOS();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Erro ao registrar pagamento. Verifique se o caixa está aberto.';
            toast.error(msg);
        } finally {
            setProcessingPayment(false);
        }
    };

    if (loading) return <div className="p-6">Carregando...</div>;
    if (!os) return null;

    return (
        <>
            <Header title={`OS #${os.numero || os.id.substring(0, 6)}`} />
            <div className="p-6">
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

                    {/* INFO PRINCIPAL */}
                    <div className="card" style={{ flex: 2, minWidth: '300px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div>
                                <span style={{
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '0.4rem',
                                    background: os.status === 'FINALIZADA' ? '#e1f0ff' : '#fff4de',
                                    color: os.status === 'FINALIZADA' ? '#3699ff' : '#ffa800',
                                    fontWeight: 'bold'
                                }}>
                                    {os.status}
                                </span>
                            </div>
                            <div style={{ color: '#999', fontSize: '0.9rem' }}>
                                {new Date(os.criado_em).toLocaleDateString()}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '0.9rem', color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Cliente</h3>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{os.cliente?.nome}</div>
                                <div style={{ color: '#666' }}>{os.cliente?.telefone}</div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.9rem', color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Veículo</h3>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{os.veiculo?.modelo}</div>
                                <div style={{ color: '#666' }}>{os.veiculo?.placa} • {PorteLabel[os.veiculo?.porte as PorteVeiculo]}</div>
                            </div>
                        </div>

                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Serviços</h3>
                        <div style={{ marginBottom: '2rem' }}>
                            {os.itens?.map((item: any) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px dashed #eee' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                            {item.servico?.nome || 'Serviço'}
                                        </div>
                                        {item.funcionario && (
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                                                👤 Executado por: <span style={{ fontWeight: 500 }}>{item.funcionario.nome}</span> {item.pontos ? `(${item.pontos} pts)` : ''}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                        R$ {(item.valor_centavos / 100).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {os.combo && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px dashed #eee' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                                            [COMBO] {os.combo.combo?.nome || 'Combo'}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                                            Combo {PorteLabel[os.combo.porte as PorteVeiculo]}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                        R$ {(os.combo.valor_centavos / 100).toFixed(2)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Observações e Pertences */}
                        {(os.observacoes || os.descricao_pertences) && (
                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '0.4rem', border: '1px solid #eee' }}>
                                <h3 style={{ borderBottom: '1px solid #e4e6ef', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📋</span> Detalhes da Recepção
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                    {os.observacoes && (
                                        <div>
                                            <h4 style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>Observações do Veículo</h4>
                                            <p style={{ color: '#3f4254', whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{os.observacoes}</p>
                                        </div>
                                    )}

                                    {os.descricao_pertences && (
                                        <div>
                                            <h4 style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                                                Pertences {os.pertence_valor && <span style={{ color: '#ffa800', background: '#fff4de', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', marginLeft: '4px' }}>De Valor</span>}
                                            </h4>
                                            <p style={{ color: '#3f4254', whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{os.descricao_pertences}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div style={{ textAlign: 'right', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Total: R$ {(os.total_centavos / 100).toFixed(2)}
                        </div>

                        {os.pagamentos?.length > 0 && (
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <h4 style={{ fontSize: '0.9rem', color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pagamentos</h4>
                                {os.pagamentos.map((p: any) => (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: '#555' }}>
                                        <span>{p.forma_pagamento} ({new Date(p.pago_em).toLocaleDateString()})</span>
                                        <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>- R$ {(p.valor_centavos / 100).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="card" style={{ flex: 1, minWidth: '250px', height: 'fit-content' }}>
                        <h3 className="font-bold mb-4">Ações</h3>

                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {os.status === 'ABERTA' && (
                                <button onClick={() => handleStatusChange('EM_EXECUCAO')} style={{ padding: '0.75rem', background: '#3699ff', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                                    Iniciar Execução
                                </button>
                            )}
                            {os.status === 'EM_EXECUCAO' && (
                                <button onClick={() => handleStatusChange('FINALIZADA')} style={{ padding: '0.75rem', background: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                                    Finalizar Serviço
                                </button>
                            )}
                            {/* Payment Logic */}
                            {(() => {
                                const totalPago = os.pagamentos?.reduce((acc: number, p: any) => acc + p.valor_centavos, 0) || 0;
                                const restante = os.total_centavos - totalPago;
                                const isPago = restante <= 0;

                                if (os.status === 'FINALIZADA') {
                                    if (!isPago) {
                                        return (
                                            <button onClick={() => setShowPaymentModal(true)} style={{ padding: '0.75rem', background: '#ffa800', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}>
                                                Receber Pagamento (Restam R$ {(restante / 100).toFixed(2)})
                                            </button>
                                        );
                                    } else {
                                        return (
                                            <div style={{ padding: '0.75rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '0.4rem', fontWeight: 600, textAlign: 'center', border: '1px solid #c8e6c9' }}>
                                                ✅ Pago Totalmente
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })()}

                            {os.status !== 'CANCELADA' && os.status !== 'FINALIZADA' && (
                                <button
                                    onClick={() => {
                                        if (confirm('Tem certeza que deseja cancelar esta OS?')) {
                                            handleStatusChange('CANCELADA');
                                        }
                                    }}
                                    style={{ padding: '0.75rem', background: '#ffe2e5', color: '#f64e60', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600, marginTop: '1rem' }}
                                >
                                    Cancelar OS
                                </button>
                            )}

                            <button onClick={() => router.push('/os')} style={{ padding: '0.75rem', background: '#f3f6f9', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', color: '#7e8299', fontWeight: 600 }}>
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', width: '400px', maxWidth: '90%' }}>
                        <h2 className="font-bold text-lg mb-4">Receber Pagamento</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Forma de Pagamento</label>
                            <select
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                            >
                                <option value="DINHEIRO">Dinheiro</option>
                                <option value="PIX">Pix</option>
                                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>
                            Valor: R$ {(os.total_centavos / 100).toFixed(2)}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                disabled={processingPayment}
                                style={{ padding: '0.75rem 1.5rem', background: '#eee', border: 'none', borderRadius: '0.4rem', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={processingPayment}
                                style={{ padding: '0.75rem 1.5rem', background: '#ffa800', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                {processingPayment ? 'Processando...' : 'Confirmar Recebimento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
