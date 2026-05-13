"use client";

import { useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/forgot-password', { email });
            toast.success(response.data?.message || 'Se o e-mail existir, as instruções foram enviadas.');
            router.push('/login');
        } catch (err) {
            console.error(err);
            toast.error('Ocorreu um erro ao solicitar a recuperação de senha.');
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
                    <p style={{ color: '#b5b5c3', fontSize: '0.9rem', marginTop: '0.5rem' }}>Recuperação de Senha</p>
                </div>

                <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: '#7e8299', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                            Informe seu e-mail cadastrado. Enviaremos uma senha temporária para você acessar o sistema.
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
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
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
                        {loading ? 'Enviando...' : 'Enviar Nova Senha'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#b5b5c3' }}>
                    Lembrou da senha? <a href="/login" style={{ color: '#3699ff', fontWeight: 600, textDecoration: 'none' }}>Voltar ao login</a>
                </div>
            </div>
        </div>
    );
}
