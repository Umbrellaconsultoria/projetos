"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, senha: password });
            const { access_token } = response.data;

            // Decodificar payload do JWT
            const payloadBase64 = access_token.split('.')[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);

            const decodedUser = {
                id: payload.sub,
                nome: "Usuário", // Podemos buscar nome se necessário ou usar o email provisório
                email: payload.email,
                logo_url: payload.logo_url,
                id_tenant: payload.id_tenant,
                is_saas_provider: payload.is_saas_provider
            };

            login(access_token, decodedUser);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 403 && err.response?.data?.code === 'REQUIRE_PASSWORD_CHANGE') {
                // Redirecionar para a tela de alteração obrigatória
                router.push(`/first-login-change-password?email=${encodeURIComponent(email)}`);
                return;
            }
            setError('Falha no login. Verifique suas credenciais.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#eef0f8', // var(--color-body-bg)
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem 3rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e1e2d' }}>CleanCar</h1>
                    <p style={{ color: '#b5b5c3', fontSize: '0.9rem', marginTop: '0.5rem' }}>Entre para gerenciar seu negócio</p>
                    {error && <div style={{ color: '#f64e60', fontSize: '0.9rem', marginTop: '1rem', background: '#ffe6e6', padding: '0.5rem', borderRadius: '0.3rem' }}>{error}</div>}
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', transition: 'border 0.2s', fontSize: '0.9rem' }}
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#3f4254' }}>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ebedf3', backgroundColor: '#f3f6f9', outline: 'none', transition: 'border 0.2s', fontSize: '0.9rem' }}
                            placeholder="********"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7e8299', cursor: 'pointer' }}>
                            <input type="checkbox" /> Lembrar de mim
                        </label>
                        <a href="/forgot-password" style={{ color: '#3699ff', fontWeight: 600 }}>Esqueceu a senha?</a>
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            backgroundColor: '#3699ff',
                            color: 'white',
                            fontWeight: 600,
                            padding: '0.8rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Entrar
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#b5b5c3' }}>
                    Ainda não tem conta? <a href="/register" style={{ color: '#3699ff', fontWeight: 600, textDecoration: 'none' }}>Criar conta</a>
                </div>
            </div>
        </div>
    );
}
