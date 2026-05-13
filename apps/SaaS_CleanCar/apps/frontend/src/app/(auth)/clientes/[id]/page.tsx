"use client";

import { Header } from "@/components/layout/Header";
import { clientesService } from "@/services/clientes";
import { veiculosService } from "@/services/veiculos";
import { Cliente, PorteVeiculo, PorteLabel, Veiculo } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function EditarCliente() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');

    // Vehicle Form State
    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        placa: '',
        modelo: '',
        porte: PorteVeiculo.MEDIO,
        observacoes: ''
    });

    const fetchData = async () => {
        try {
            const clientData = await clientesService.getById(id);
            setCliente(clientData);
            setNome(clientData.nome);
            setTelefone(clientData.telefone || '');

            // Backend might return vehicles inside client, or we fetch separately.
            // Based on Prisma schema, Client has vehicles relation. 
            // If API returns it, great. If not, we might need a separate call.
            // Let's assume standard API includes relations or we fetch by client_id if we implemented that.
            // For now, let's assume clientData.veiculos is populated if backend supports it.
            // If not, we'd need to fetch /veiculos?clienteId=... (which we didn't implement filter for yet).
            // Let's rely on clientData.veiculos for now or fetch all and filter in frontend (MVP hack).

            if (clientData.veiculos) {
                setVeiculos(clientData.veiculos);
            } else {
                // Fallback: Fetch all and filter (Not ideal for prod but works for MVP with few data)
                const allVeiculos = await veiculosService.getAll();
                setVeiculos(allVeiculos.filter(v => v.id_cliente === id));
            }

        } catch (error) {
            console.error("Erro ao carregar cliente", error);
            toast.error("Cliente não encontrado");
            router.push('/clientes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const handleUpdateCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await clientesService.update(id, { nome, telefone });
            toast.success('Cliente atualizado!');
        } catch (error) {
            toast.error('Erro ao atualizar cliente');
        }
    };

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await veiculosService.create({
                id_cliente: id,
                ...newVehicle
            });
            setShowVehicleForm(false);
            setNewVehicle({ placa: '', modelo: '', porte: PorteVeiculo.MEDIO, observacoes: '' });
            fetchData(); // Reload data
        } catch (error) {
            toast.error('Erro ao adicionar veículo. Verifique a placa.');
        }
    };

    const handleDeleteVehicle = async (vehicleId: string) => {
        if (confirm('Remover veículo?')) {
            await veiculosService.delete(vehicleId);
            fetchData();
        }
    }

    if (loading) return <div className="p-6">Carregando...</div>;

    return (
        <>
            <Header title={`Editar Cliente: ${cliente?.nome}`} />
            <div className="p-6">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* Coluna 1: Dados do Cliente */}
                    <div className="card">
                        <h2 className="text-lg font-bold mb-4">Dados Pessoais</h2>
                        <form onSubmit={handleUpdateCliente} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nome</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Telefone</label>
                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={e => setTelefone(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{ padding: '0.75rem', borderRadius: '0.4rem', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Salvar Alterações
                            </button>
                        </form>
                    </div>

                    {/* Coluna 2: Veículos */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 className="text-lg font-bold">Veículos</h2>
                            <button
                                onClick={() => setShowVehicleForm(!showVehicleForm)}
                                style={{ padding: '0.5rem 1rem', borderRadius: '0.4rem', border: '1px solid var(--color-border)', background: '#f3f6f9', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                            >
                                {showVehicleForm ? 'Cancelar' : '+ Adicionar'}
                            </button>
                        </div>

                        {showVehicleForm && (
                            <form onSubmit={handleAddVehicle} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px dashed var(--color-border)' }}>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <input placeholder="Placa (ABC1D23)" value={newVehicle.placa} onChange={e => setNewVehicle({ ...newVehicle, placa: e.target.value.toUpperCase() })} style={{ padding: '0.5rem', borderRadius: '0.3rem', border: '1px solid #ddd' }} required />
                                    <input placeholder="Modelo (Ex: Civic)" value={newVehicle.modelo} onChange={e => setNewVehicle({ ...newVehicle, modelo: e.target.value })} style={{ padding: '0.5rem', borderRadius: '0.3rem', border: '1px solid #ddd' }} required />
                                    <select
                                        value={newVehicle.porte}
                                        onChange={e => setNewVehicle({ ...newVehicle, porte: e.target.value as PorteVeiculo })}
                                        style={{ padding: '0.5rem', borderRadius: '0.3rem', border: '1px solid #ddd' }}
                                    >
                                        {Object.entries(PorteLabel).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                    <button type="submit" style={{ padding: '0.5rem', background: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '0.3rem', fontWeight: 600, cursor: 'pointer' }}>Salvar Veículo</button>
                                </div>
                            </form>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {veiculos.map(v => (
                                <div key={v.id} style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{v.modelo}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{v.placa} • {PorteLabel[v.porte]}</div>
                                    </div>
                                    <button onClick={() => handleDeleteVehicle(v.id)} style={{ color: 'var(--color-danger)', border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
                                </div>
                            ))}
                            {veiculos.length === 0 && !showVehicleForm && (
                                <div style={{ textAlign: 'center', color: '#b5b5c3', padding: '1rem' }}>Nenhum veículo cadastrado.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
