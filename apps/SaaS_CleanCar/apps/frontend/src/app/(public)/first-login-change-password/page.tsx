"use client";

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function FirstLoginChangePasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    const initialEmail = searchParams.get('email') || '';
    const [email, setEmail] = useState(initialEmail);
    const [temporaryPassword, setTemporaryPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, [initialEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('A nova senha e a confirmação não coincidem.');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/first-login-change-password', {
                email,
                senhaTemporaria: temporaryPassword,
                novaSenha: newPassword
            });

            const { access_token } = response.data;
            // Similar ao login, usamos um mock temporário até integrarmos o contexto de fetchProfile
            const mockUser = { id: '1', nome: 'Admin', email };

            toast.success('Senha alterada com sucesso!');
            login(access_token, mockUser);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Falha ao alterar senha. Verifique as informações.');
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
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem 3rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '430px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1e2d' }}>CleanCar</h1>
                    <p style={{ color: '#b5b5c3', fontSize: '0.9rem', marginTop: '0.5rem' }}>Alteração de Senha Obrigatória</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: '#7e8299', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                            Por medida de segurança, você precisa criar uma nova senha definitiva para o seu primeiro acesso.
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', transition: 'border 0.2s', fontSize: '0.9rem' }}
                            placeholder="seu@email.com"
                            readOnly={!!initialEmail}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Senha Temporária</label>
                        <input
                            type="password"
                            required
                            value={temporaryPassword}
                            onChange={(e) => setTemporaryPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', transition: 'border 0.2s', fontSize: '0.9rem' }}
                            placeholder="Enviada por e-mail"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Nova Senha</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', transition: 'border 0.2s', fontSize: '0.9rem' }}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Confirmar Nova Senha</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', transition: 'border 0.2s', fontSize: '0.9rem' }}
                            placeholder="Repita a nova senha"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            backgroundColor: loading ? '#a1a5b7' : '#3699ff',
                            color: 'white',
                            fontWeight: 600,
                            padding: '0.8rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? 'Alterando e Entrando...' : 'Alterar Senha e Entrar'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#b5b5c3' }}>
                    <a href="/login" style={{ color: '#3699ff', fontWeight: 600, textDecoration: 'none' }}>Voltar ao login</a>
                </div>
            </div>
        </div>
    );
}
