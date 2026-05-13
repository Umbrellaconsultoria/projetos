"use client";

import { useState } from 'react';
import { tenantsService, CreateTenantDto } from '@/services/tenants';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateTenantDto>({
        nome_fantasia: '',
        razao_social: '',
        cnpj: '',
        telefone: '',
        nome_usuario: '',
        email_usuario: '',
        senha_usuario: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await tenantsService.create(formData);
            toast.success('Empresa registrada com sucesso! Faça login para começar.', { duration: 5000 });
            router.push('/login');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Falha ao registrar empresa. Verifique os dados fornecidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#eef0f8',
            padding: '2rem 1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2.5rem 3rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '600px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1e2d' }}>CleanCar</h1>
                    <p style={{ color: '#b5b5c3', fontSize: '0.9rem', marginTop: '0.5rem' }}>Crie a conta da sua empresa e comece a usar agora</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'grid', gap: '1.25rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e1e2d', borderBottom: '1px solid #ebedf3', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Dados da Empresa</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Nome Fantasia *</label>
                                <input
                                    required
                                    type="text"
                                    name="nome_fantasia"
                                    value={formData.nome_fantasia}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '0.9rem' }}
                                    placeholder="Nome da sua loja/empresa"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Razão Social</label>
                                <input
                                    type="text"
                                    name="razao_social"
                                    value={formData.razao_social}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '0.9rem' }}
                                    placeholder=""
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>CNPJ</label>
                                <input
                                    type="text"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '0.9rem' }}
                                    placeholder="Apenas números"
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Telefone</label>
                                <input
                                    type="text"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '0.9rem' }}
                                    placeholder="(XX) XXXXX-XXXX"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e1e2d', borderBottom: '1px solid #ebedf3', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Dados do Administrador</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Seu Nome *</label>
                                <input
                                    required
                                    type="text"
                                    name="nome_usuario"
                                    value={formData.nome_usuario}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '0.9rem' }}
                                    placeholder="Ex: João da Silva"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>E-mail para Acesso *</label>
                                <input
                                    required
                                    type="email"
                                    name="email_usuario"
                                    value={formData.email_usuario}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '0.9rem' }}
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Senha *</label>
                                <input
                                    required
                                    type="password"
                                    name="senha_usuario"
                                    value={formData.senha_usuario}
                                    onChange={handleChange}
                                    minLength={6}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', fontSize: '0.9rem' }}
                                    placeholder="No mínimo 6 caracteres"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1.5rem',
                            backgroundColor: '#3699ff',
                            color: 'white',
                            fontWeight: 600,
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Criando sua conta...' : 'Finalizar Cadastro'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#b5b5c3' }}>
                    Já tem uma conta? <a href="/login" style={{ color: '#3699ff', fontWeight: 600, textDecoration: 'none' }}>Fazer login</a>
                </div>
            </div>
        </div>
    );
}
