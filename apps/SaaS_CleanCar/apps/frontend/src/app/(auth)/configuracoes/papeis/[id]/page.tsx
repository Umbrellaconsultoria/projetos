'use client';

import { Header } from "@/components/layout/Header";
import { rbacService, Permissao } from "@/services/rbac";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import toast from 'react-hot-toast';

export default function EditarPapelPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const roleId = resolvedParams.id;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [nome, setNome] = useState('');
    const [permissoesDisponiveis, setPermissoesDisponiveis] = useState<Permissao[]>([]);
    const [selectedPermissoes, setSelectedPermissoes] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all permissions and the role itself concurrently
                const [permsData, roleData] = await Promise.all([
                    rbacService.getAllPermissions(),
                    rbacService.getRoleById(roleId)
                ]);

                setPermissoesDisponiveis(permsData);
                setNome(roleData.nome);

                // roleData.permissoes is an array of objects like { permissao: { chave: '...', ... } }
                if (roleData.permissoes) {
                    const currentPerms = roleData.permissoes.map(p => p.permissao.chave);
                    setSelectedPermissoes(currentPerms);
                }
            } catch (error) {
                console.error(error);
                toast.error('Erro ao carregar dados do papel');
                router.push('/configuracoes/papeis');
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [roleId, router]);

    const togglePermissao = (chave: string) => {
        setSelectedPermissoes(prev =>
            prev.includes(chave) ? prev.filter(c => c !== chave) : [...prev, chave]
        );
    };

    const handleSelectAll = () => {
        if (selectedPermissoes.length === permissoesDisponiveis.length) {
            setSelectedPermissoes([]);
        } else {
            setSelectedPermissoes(permissoesDisponiveis.map(p => p.chave));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await rbacService.updateRole(roleId, {
                nome,
                permissoes: selectedPermissoes
            });

            toast.success('Papel atualizado com sucesso!');
            router.push('/configuracoes/papeis');
        } catch (error: any) {
            console.error(error);
            toast.error('Erro ao atualizar papel: ' + (error.response?.data?.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    // Group permissions by category (prefix before _)
    const groupedPermissions = permissoesDisponiveis.reduce((acc, curr) => {
        const prefix = curr.chave.split('_')[1] || 'GERAL'; // e.g. criar_CLIENTE -> CLIENTE
        if (!acc[prefix]) acc[prefix] = [];
        acc[prefix].push(curr);
        return acc;
    }, {} as Record<string, Permissao[]>);

    return (
        <>
            <Header title="Editar Papel de Acesso" />
            <div className="p-6">
                {loadingData ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando dados...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold">Nome do Papel</label>
                            <input
                                type="text"
                                required
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                className="w-full p-2 border rounded"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.4rem' }}
                                placeholder="Ex: Gerente Financeiro"
                            />
                        </div>

                        <div className="mb-6">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                <h3 className="font-bold">Permissões ({selectedPermissoes.length} selecionadas)</h3>
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {selectedPermissoes.length === permissoesDisponiveis.length ? 'Desmarcar Todas' : 'Marcar Todas'}
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                {Object.entries(groupedPermissions).map(([category, perms]) => (
                                    <div key={category}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', marginBottom: '0.5rem' }}>
                                            {category}
                                        </h4>
                                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                                            {perms.map(p => (
                                                <label key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissoes.includes(p.chave)}
                                                        onChange={() => togglePermissao(p.chave)}
                                                        style={{ marginTop: '0.25rem' }}
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{p.chave}</span>
                                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{p.descricao}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                                style={{ padding: '0.75rem 1.5rem', background: '#eee', border: 'none', borderRadius: '0.4rem', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
                                style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
