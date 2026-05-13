"use client";

import { Header } from "@/components/layout/Header";
import { clientesService } from "@/services/clientes";
import { osService } from "@/services/os";
import { servicosService, Servico } from "@/services/servicos";
import { combosService, Combo } from "@/services/combos";
import { funcionariosService, Funcionario } from "@/services/funcionarios";
import { veiculosService } from "@/services/veiculos";
import { Cliente, PorteLabel, PorteVeiculo, Veiculo } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function NovaOS() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Data Sources
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [allVeiculos, setAllVeiculos] = useState<Veiculo[]>([]);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);

    // Step 1: Client
    const [selectedClienteId, setSelectedClienteId] = useState<string>('');
    const [clientVehicles, setClientVehicles] = useState<Veiculo[]>([]);

    // Step 2: Vehicles (Multi-select)
    const [selectedVeiculos, setSelectedVeiculos] = useState<Veiculo[]>([]);

    // Step 3: Services (Per Vehicle)
    // Map vehicleId -> array of serviceIds
    const [veiculoServicos, setVeiculoServicos] = useState<Record<string, string[]>>({});
    // Map vehicleId -> serviceId -> funcionarioId
    const [atribuicoes, setAtribuicoes] = useState<Record<string, Record<string, string>>>({});
    // Map vehicleId -> comboId
    const [veiculoCombo, setVeiculoCombo] = useState<Record<string, string>>({});
    // Map vehicleId -> text
    const [observacoes, setObservacoes] = useState<Record<string, string>>({});
    const [descricaoPertences, setDescricaoPertences] = useState<Record<string, string>>({});

    // Load initial data
    useEffect(() => {
        Promise.all([
            clientesService.getAll(),
            servicosService.getAll(),
            veiculosService.getAll(),
            funcionariosService.findAll(),
            combosService.getAll()
        ]).then(([cls, srvs, vcls, funcs, cmbs]) => {
            setClientes(cls);
            setServicos(srvs);
            setAllVeiculos(vcls);
            setFuncionarios(funcs);
            setCombos(cmbs.filter(c => c.ativo));
        }).catch(console.error);
    }, []);

    // Handle Client Change
    const handleClientChange = (clientId: string) => {
        setSelectedClienteId(clientId);
        if (clientId) {
            const filtered = allVeiculos.filter(v => v.id_cliente === clientId);
            setClientVehicles(filtered);
            setSelectedVeiculos([]); // Reset selection
            setVeiculoServicos({});
        } else {
            setClientVehicles([]);
        }
    };

    // Handle Vehicle Toggle
    const handleVehicleToggle = (veiculo: Veiculo) => {
        const exists = selectedVeiculos.find(v => v.id === veiculo.id);
        if (exists) {
            setSelectedVeiculos(selectedVeiculos.filter(v => v.id !== veiculo.id));
            const newSvcs = { ...veiculoServicos };
            delete newSvcs[veiculo.id];
            setVeiculoServicos(newSvcs);
        } else {
            setSelectedVeiculos([...selectedVeiculos, veiculo]);
            setVeiculoServicos({ ...veiculoServicos, [veiculo.id]: [] });
        }
    };

    // Handle Service Toggle
    const handleServiceToggle = (veiculoId: string, servicoId: string) => {
        const current = veiculoServicos[veiculoId] || [];
        const exists = current.includes(servicoId);

        let newServices;
        if (exists) {
            newServices = current.filter(id => id !== servicoId);
        } else {
            newServices = [...current, servicoId];
        }

        setVeiculoServicos({
            ...veiculoServicos,
            [veiculoId]: newServices
        });
    };

    const handleSave = async () => {
        if (selectedVeiculos.length === 0) return toast.error('Selecione ao menos um veículo.');

        const missingServices = selectedVeiculos.some(v => (veiculoServicos[v.id] || []).length === 0 && !veiculoCombo[v.id]);
        if (missingServices) return toast.error('Selecione ao menos um serviço ou combo para cada veículo.');

        setLoading(true);
        const client = clientes.find(c => c.id === selectedClienteId);
        if (!client) return;

        try {
            // Create one OS per Vehicle (Batch)
            const promises = selectedVeiculos.map(veiculo => {
                const servicosIds = veiculoServicos[veiculo.id] || [];

                const payload = {
                    cliente: { nome: client.nome, telefone: client.telefone || '' },
                    placa: veiculo.placa,
                    veiculo: {
                        modelo: veiculo.modelo,
                        porte: veiculo.porte
                    },
                    itens: servicosIds.map(id => ({
                        id_servico: id,
                        porte: veiculo.porte,
                        id_funcionario: atribuicoes[veiculo.id]?.[id] || undefined
                    })),
                    prazo: new Date().toISOString(),
                    id_combo: veiculoCombo[veiculo.id] || undefined,
                    observacoes: observacoes[veiculo.id] || '',
                    pertence_valor: !!descricaoPertences[veiculo.id],
                    descricao_pertences: descricaoPertences[veiculo.id] || ''
                };
                return osService.create(payload as any);
            });

            await Promise.all(promises);
            toast.success(`Sucesso! ${selectedVeiculos.length} Ordem(ns) de Serviço criada(s).`);
            router.push('/os');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao criar OS(s). Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Nova Ordem de Serviço" />
            <div className="p-6">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div className={`step ${step >= 1 ? 'active' : ''}`} style={{ fontWeight: step === 1 ? 'bold' : 'normal' }}>1. Cliente</div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`} style={{ fontWeight: step === 2 ? 'bold' : 'normal' }}>2. Veículos</div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`} style={{ fontWeight: step === 3 ? 'bold' : 'normal' }}>3. Serviços</div>
                </div>

                <div className="card" style={{ maxWidth: '900px' }}>

                    {/* FASE 1: CLIENTE */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">Selecione o Cliente</h2>
                            <select
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                                onChange={e => handleClientChange(e.target.value)}
                                value={selectedClienteId}
                            >
                                <option value="">-- Selecione --</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select>

                            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!selectedClienteId}
                                    style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', opacity: !selectedClienteId ? 0.5 : 1 }}
                                >
                                    Próximo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FASE 2: VEICULOS (MULTI) */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">Selecione os Veículos</h2>

                            {clientVehicles.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '0.4rem' }}>
                                    Este cliente não possui veículos cadastrados.<br />
                                    <small>Cadastre um veículo no menu Clientes primeiro.</small>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {clientVehicles.map(v => {
                                        const isSelected = !!selectedVeiculos.find(sel => sel.id === v.id);
                                        return (
                                            <div
                                                key={v.id}
                                                onClick={() => handleVehicleToggle(v)}
                                                style={{
                                                    padding: '1rem',
                                                    border: `1px solid ${isSelected ? 'var(--color-primary)' : '#eee'}`,
                                                    borderRadius: '0.4rem',
                                                    background: isSelected ? '#f0f9ff' : 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '1rem'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    readOnly
                                                    style={{ transform: 'scale(1.2)' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{v.modelo}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{v.placa} • {PorteLabel[v.porte]}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                <button onClick={() => setStep(1)} style={{ padding: '0.75rem', background: '#e4e6ef', border: 'none', borderRadius: '0.4rem', fontWeight: 600 }}>Voltar</button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={selectedVeiculos.length === 0}
                                    style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', opacity: selectedVeiculos.length === 0 ? 0.5 : 1 }}
                                >
                                    Próximo ({selectedVeiculos.length})
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FASE 3: SERVICOS PER VEICULO */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-lg font-bold mb-6">Definir Serviços</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {selectedVeiculos.map((veiculo, idx) => (
                                    <div key={veiculo.id} style={{ border: '1px solid #ddd', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                        <div style={{ background: '#f5f8fa', padding: '1rem', borderBottom: '1px solid #ddd', fontWeight: 600 }}>
                                            {idx + 1}. {veiculo.modelo} <span style={{ fontWeight: 'normal', color: '#666' }}>({veiculo.placa})</span>
                                        </div>
                                        <div style={{ padding: '1rem' }}>
                                            {/* Combos */}
                                            {combos.length > 0 && (
                                                <div style={{ marginBottom: '1.5rem', background: '#fdfdfd', padding: '1rem', borderRadius: '0.4rem', border: '1px solid #eee' }}>
                                                    <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selecionar Combo (Opcional)</h3>
                                                    <select
                                                        value={veiculoCombo[veiculo.id] || ''}
                                                        onChange={(e) => setVeiculoCombo(prev => ({ ...prev, [veiculo.id]: e.target.value }))}
                                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem', marginBottom: veiculoCombo[veiculo.id] ? '1rem' : '0' }}
                                                    >
                                                        <option value="">Nenhum combo selecionado</option>
                                                        {combos.map(combo => {
                                                            const preco = combo.precos?.find(p => p.porte === veiculo.porte)?.valor_centavos || 0;
                                                            return (
                                                                <option key={combo.id} value={combo.id}>
                                                                    {combo.nome} - R$ {(preco / 100).toFixed(2)}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>

                                                    {veiculoCombo[veiculo.id] && (
                                                        <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#eef6ff', borderRadius: '0.4rem', fontSize: '0.85rem', color: '#333' }}>
                                                            <strong>Itens inclusos no Combo:</strong>
                                                            <ul style={{ listStyleType: 'disc', marginLeft: '1.5rem', marginTop: '0.25rem', color: '#555' }}>
                                                                {combos.find(c => c.id === veiculoCombo[veiculo.id])?.itens?.map(item => {
                                                                    const servicoFull = servicos.find(s => s.id === item.id_servico);
                                                                    const precoItem = servicoFull?.precos?.find(p => p.porte === veiculo.porte)?.valor_centavos || 0;
                                                                    return (
                                                                        <li key={item.id_servico}>
                                                                            {item.servico?.nome} - R$ {(precoItem / 100).toFixed(2)}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Serviços Individuais</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                                {servicos.map(servico => {
                                                    const isSelected = (veiculoServicos[veiculo.id] || []).includes(servico.id);
                                                    const preco = servico.precos.find(p => p.porte === veiculo.porte)?.valor_centavos || 0;

                                                    return (
                                                        <div key={servico.id} style={{
                                                            border: `1px solid ${isSelected ? 'var(--color-primary)' : '#eee'}`,
                                                            borderRadius: '0.4rem',
                                                            background: isSelected ? '#f0f9ff' : 'white',
                                                            transition: 'all 0.2s',
                                                            display: 'flex',
                                                            flexDirection: 'column'
                                                        }}>
                                                            <div
                                                                onClick={() => handleServiceToggle(veiculo.id, servico.id)}
                                                                style={{
                                                                    padding: '0.75rem',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{servico.nome} {servico.pontos ? `(${servico.pontos}pts)` : ''}</span>
                                                                    {isSelected && <span style={{ color: 'var(--color-primary)' }}>✓</span>}
                                                                </div>
                                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>R$ {(preco / 100).toFixed(2)}</div>
                                                            </div>

                                                            {isSelected && (
                                                                <div style={{ padding: '0 0.75rem 0.75rem 0.75rem', borderTop: '1px dashed #bee4ff', marginTop: '0.25rem', paddingTop: '0.5rem' }}>
                                                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--color-primary)', display: 'block', marginBottom: '0.2rem' }}>Executado por:</label>
                                                                    <select
                                                                        value={atribuicoes[veiculo.id]?.[servico.id] || ''}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            setAtribuicoes(prev => ({
                                                                                ...prev,
                                                                                [veiculo.id]: {
                                                                                    ...(prev[veiculo.id] || {}),
                                                                                    [servico.id]: val
                                                                                }
                                                                            }));
                                                                        }}
                                                                        style={{ fontSize: '0.8rem', padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #91d2ff', width: '100%', background: 'white' }}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <option value="">Não atribuído</option>
                                                                        {funcionarios.map(f => (
                                                                            <option key={f.id} value={f.id}>{f.nome}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {/* Observações e Pertences (Por Veículo) */}
                                            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                        Observações do Veículo
                                                        <span style={{ display: 'block', fontWeight: 'normal', fontSize: '0.75rem', color: '#666' }}>
                                                            Ex: Amassados, arranhões, vidros trincados
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        value={observacoes[veiculo.id] || ''}
                                                        onChange={(e) => setObservacoes(prev => ({ ...prev, [veiculo.id]: e.target.value }))}
                                                        rows={3}
                                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem', fontSize: '0.9rem' }}
                                                        placeholder="Nenhuma observação..."
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                                        Pertences e Objetos de Valor
                                                        <span style={{ display: 'block', fontWeight: 'normal', fontSize: '0.75rem', color: '#666' }}>
                                                            Ex: Carteira no porta-luvas, óculos escuros
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        value={descricaoPertences[veiculo.id] || ''}
                                                        onChange={(e) => setDescricaoPertences(prev => ({ ...prev, [veiculo.id]: e.target.value }))}
                                                        rows={3}
                                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem', fontSize: '0.9rem' }}
                                                        placeholder="Nenhum pertence de valor declarado..."
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <button onClick={() => setStep(2)} style={{ padding: '0.75rem', background: '#e4e6ef', border: 'none', borderRadius: '0.4rem', fontWeight: 600 }}>Voltar</button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    style={{ padding: '0.75rem 2rem', background: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                                >
                                    {loading ? 'Processando...' : 'Finalizar Pedido'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div >
        </>
    );
}
