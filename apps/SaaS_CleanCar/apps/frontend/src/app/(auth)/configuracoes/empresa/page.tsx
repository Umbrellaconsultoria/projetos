"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Header } from '@/components/layout/Header';
import toast from 'react-hot-toast';

export default function EmpresaSettingsPage() {
    const { user, login } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.type.startsWith('image/')) {
                toast.error('Selecione apenas arquivos de imagem.');
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            if (!user.id_tenant) {
                toast.error('Não foi possível identificar a empresa. Faça login novamente.');
                return;
            }

            const response = await api.post(`/tenants/${user.id_tenant}/logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUser = { ...user, logo_url: response.data.logo_url };
            login(localStorage.getItem('token') || '', updatedUser);

            toast.success('Logomarca atualizada com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao enviar logomarca.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="page-container">
            <Header title="Configurações da Empresa" />
            <div className="page-content">
                <main className="main-content">
                    <div className="card" style={{ maxWidth: '600px' }}>
                        <h2 className="text-xl font-bold mb-4">Logomarca da Empresa</h2>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            Faça o upload da logomarca que será exibida no painel administrativo e relatórios.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
                            {previewUrl || user?.logo_url ? (
                                <img
                                    src={previewUrl || `http://localhost:3333${user?.logo_url}`}
                                    alt="Pré-visualização"
                                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain', border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px' }}
                                />
                            ) : (
                                <div style={{ width: '200px', height: '100px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: '4px' }}>
                                    <span>Sem logomarca</span>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ marginTop: '1rem' }}
                            />

                            <button
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                                className="btn-primary"
                                style={{ marginTop: '1rem' }}
                            >
                                {isUploading ? 'Enviando...' : 'Salvar Logomarca'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
