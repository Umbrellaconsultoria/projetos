"use client";

import { Header } from "@/components/layout/Header";
import { clientesService } from "@/services/clientes";
import { financeiroService } from "@/services/financeiro";
import { osService } from "@/services/os";
import { veiculosService } from "@/services/veiculos";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    osAbertas: 0,
    faturamentoHoje: 0,
    totalClientes: 0,
    totalVeiculos: 0
  });
  const [recentOs, setRecentOs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [osList, clientes, veiculos, caixa] = await Promise.all([
          osService.getAll(),
          clientesService.getAll(),
          veiculosService.getAll(),
          financeiroService.getCaixaStatus()
        ]);

        const abertas = osList.filter(o => o.status !== 'FINALIZADA' && o.status !== 'CANCELADA').length;

        // Mocking "Faturamento Hoje" as Caixa Balance for MVP or current OS sum
        // Better use Caixa Balance
        const faturamento = caixa.saldo_atual_centavos;

        setStats({
          osAbertas: abertas,
          faturamentoHoje: faturamento,
          totalClientes: clientes.length,
          totalVeiculos: veiculos.length
        });

        setRecentOs(osList.slice(0, 5)); // Get first 5 (assuming backend sorts or we sort)
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6">

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

          <div className="card" style={{ borderLeft: '4px solid #3699ff' }}>
            <div style={{ color: '#999', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Faturamento (Caixa)</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3f4254' }}>
              R$ {(stats.faturamentoHoje / 100).toFixed(2).replace('.', ',')}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b5b5c3' }}>Status: Atual</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #ffa800' }}>
            <div style={{ color: '#999', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>OS em Aberto</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3f4254' }}>
              {stats.osAbertas}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b5b5c3' }}>Aguardando ou Em Execução</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #1bc5bd' }}>
            <div style={{ color: '#999', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Base de Clientes</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3f4254' }}>
              {stats.totalClientes} <span style={{ fontSize: '1rem', color: '#999', fontWeight: 'normal' }}>/ {stats.totalVeiculos} Veículos</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b5b5c3' }}>Cadastrados</div>
          </div>

        </div>

        {/* ACTIONS */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/os/nova" style={{ padding: '0.8rem 1.5rem', background: 'var(--color-primary)', color: 'white', fontWeight: 600, borderRadius: '0.4rem', textDecoration: 'none' }}>
            + Nova OS
          </Link>
          <Link href="/clientes/novo" style={{ padding: '0.8rem 1.5rem', background: 'white', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontWeight: 600, borderRadius: '0.4rem', textDecoration: 'none' }}>
            + Novo Cliente
          </Link>
          <Link href="/financeiro" style={{ padding: '0.8rem 1.5rem', background: 'white', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontWeight: 600, borderRadius: '0.4rem', textDecoration: 'none' }}>
            $ Financeiro
          </Link>
        </div>

        {/* RECENT OS */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="font-bold text-lg">Últimas Ordens de Serviço</h3>
            <Link href="/os" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Ver Todas</Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#B5B5C3', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                <th style={{ padding: '0.5rem' }}>OS</th>
                <th style={{ padding: '0.5rem' }}>Cliente</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center' }}>Carregando...</td></tr>
              ) : recentOs.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>Nenhuma OS encontrada.</td></tr>
              ) : (
                recentOs.map(os => (
                  <tr key={os.id} style={{ borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                      <Link href={`/os/${os.id}`} style={{ color: 'var(--color-text-primary)' }}>
                        #{os.numero || '---'}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {os.cliente?.nome}
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>{os.veiculo?.modelo}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        background: os.status === 'FINALIZADA' ? '#e1f0ff' : '#fff4de',
                        color: os.status === 'FINALIZADA' ? '#3699ff' : '#ffa800',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {os.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>
                      R$ {(os.total_centavos / 100).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
