import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Church, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  Lock
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';

interface AssemblyReportModalProps {
  onClose: () => void;
}

export const AssemblyReportModal: React.FC<AssemblyReportModalProps> = ({ onClose }) => {
  const { churchInfo, transactions, financialSummary, isSigiloModeActive } = useChurch();
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  // Filter transactions for selected month
  const monthTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

  let monthEntradas = 0;
  let monthSaidas = 0;
  let dizimosTotal = 0;
  let ofertasCultoTotal = 0;
  let ofertasMissoesTotal = 0;
  let construcaoTotal = 0;

  // Breakdown expenses by category
  const expenseBreakdown: { [cat: string]: number } = {};

  monthTransactions.forEach(t => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'entrada') {
      monthEntradas += amt;
      if (t.category === 'Dízimo') dizimosTotal += amt;
      else if (t.category === 'Oferta de Culto' || t.category === 'Oferta Alçada') ofertasCultoTotal += amt;
      else if (t.category === 'Oferta Missionária') ofertasMissoesTotal += amt;
      else if (t.category === 'Campanha / Construção') construcaoTotal += amt;
    } else {
      monthSaidas += amt;
      expenseBreakdown[t.category] = (expenseBreakdown[t.category] || 0) + amt;
    }
  });

  const monthSaldo = monthEntradas - monthSaidas;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              Relatório Financeiro & Prestação de Contas
            </span>
            <p className="text-xs text-slate-400">Balancete Mensal Sintético para Assembleia da Igreja</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Relatório</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Sheet */}
        <div id="assembly-report-printable" className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-inner font-sans text-xs sm:text-sm">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Church className="w-6 h-6 text-amber-600" />
              <h2 className="font-serif font-black text-xl text-slate-900 uppercase">
                {churchInfo.name}
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              {churchInfo.address} • {churchInfo.cityState} • CNPJ: {churchInfo.pixKey}
            </p>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mt-2">
              BALANCETE DEMONSTRATIVO MENSAL — {selectedMonth}
            </h3>
            <span className="text-[10px] text-slate-500">
              Apresentado em Reunião da Diretoria e Assembleia Geral de Membros
            </span>
          </div>

          {/* Highlights summary row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total de Entradas</span>
              <strong className="text-lg font-black font-mono text-emerald-900">
                {monthEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-rose-800 block">Total de Saídas</span>
              <strong className="text-lg font-black font-mono text-rose-900">
                {monthSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Superávit / Saldo Mês</span>
              <strong className={`text-lg font-black font-mono ${monthSaldo >= 0 ? 'text-amber-900' : 'text-rose-700'}`}>
                {monthSaldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
          </div>

          {/* Section 1: Entradas Sintéticas (Confidentiality Protected) */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-300 pb-1 mb-2 flex items-center justify-between">
              <span>1. Demonstração das Entradas (Receitas Eclesiásticas)</span>
              <span className="text-[10px] text-slate-500 font-normal italic">
                * Valores consolidados sob sigilo pastoral
              </span>
            </h4>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                  <th className="py-2 px-3">Origem / Categoria</th>
                  <th className="py-2 px-3 text-right">Total Recolhido</th>
                  <th className="py-2 px-3 text-right">% do Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3 font-medium">Dízimos dos Membros (Consolidado)</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    {dizimosTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500">
                    {monthEntradas > 0 ? ((dizimosTotal / monthEntradas) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Ofertas de Cultos e Gazofilácio</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    {ofertasCultoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500">
                    {monthEntradas > 0 ? ((ofertasCultoTotal / monthEntradas) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Ofertas Missionárias & Ação Social</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    {ofertasMissoesTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-500">
                    {monthEntradas > 0 ? ((ofertasMissoesTotal / monthEntradas) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                {construcaoTotal > 0 && (
                  <tr>
                    <td className="py-2 px-3 font-medium">Campanha do Templo / Construção</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      {construcaoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500">
                      {monthEntradas > 0 ? ((construcaoTotal / monthEntradas) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-100 font-bold">
                  <td className="py-2 px-3">TOTAL DAS RECEITAS NO MÊS</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-800">
                    {monthEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Saídas / Despesas Discriminadas */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-300 pb-1 mb-2">
              2. Demonstração das Saídas (Despesas e Investimentos no Reino)
            </h4>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                  <th className="py-2 px-3">Centro de Custo / Categoria</th>
                  <th className="py-2 px-3 text-right">Valor Pago</th>
                  <th className="py-2 px-3 text-right">% das Despesas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.keys(expenseBreakdown).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-3 text-center text-slate-500">Nenhuma despesa registrada neste período.</td>
                  </tr>
                ) : (
                  Object.entries(expenseBreakdown).map(([cat, val]) => (
                    <tr key={cat}>
                      <td className="py-2 px-3 font-medium">{cat}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">
                        {val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500">
                        {monthSaidas > 0 ? ((val / monthSaidas) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))
                )}
                <tr className="bg-slate-100 font-bold">
                  <td className="py-2 px-3">TOTAL DAS DESPESAS NO MÊS</td>
                  <td className="py-2 px-3 text-right font-mono text-rose-800">
                    {monthSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Parecer Fiscal & Assinaturas */}
          <div className="border-t-2 border-slate-300 pt-6 mt-6">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed mb-6">
              <strong>PARECER DO CONSELHO FISCAL:</strong> Examinamos os livros e comprovantes de receitas e despesas correspondentes ao período acima, constatando a exatidão dos lançamentos e a correta aplicação dos recursos na obra de Deus, recomendando sua aprovação sem ressalvas pela Assembleia Geral.
            </div>

            <div className="grid grid-cols-3 gap-6 text-center text-xs text-slate-800">
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1">
                  <strong className="block text-[11px] font-bold">Pr. Janildo Manoel</strong>
                </div>
                <span className="text-[10px] text-slate-500">Pastor Presidente</span>
              </div>
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1">
                  <strong className="block text-[11px] font-bold">Tesoureiro Geral</strong>
                </div>
                <span className="text-[10px] text-slate-500">Tesouraria Eclesiástica</span>
              </div>
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1">
                  <strong className="block text-[11px] font-bold">Relator Fiscal</strong>
                </div>
                <span className="text-[10px] text-slate-500">Conselho Fiscal OBPC</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
