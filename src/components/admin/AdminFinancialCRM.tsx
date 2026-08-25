import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Printer, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  X,
  CreditCard,
  Building2,
  Heart,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import { FinancialTransaction, ChurchMember } from '../../types';
import { ReceiptPrintModal } from './ReceiptPrintModal';
import { AssemblyReportModal } from './AssemblyReportModal';

export const AdminFinancialCRM: React.FC = () => {
  const { 
    transactions, 
    members, 
    financialSummary, 
    isSigiloModeActive, 
    setSigiloModeActive, 
    addTransaction, 
    deleteTransaction,
    clearAllTransactions,
    addMember,
    updateMember,
    deleteMember,
    clearAllMembers,
    adminSession
  } = useChurch();

  // Internal tab: 'livro_caixa' | 'membros' | 'estatisticas'
  const [activeSubTab, setActiveSubTab] = useState<'livro_caixa' | 'membros' | 'estatisticas'>('livro_caixa');

  // Search & Filter for transactions
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'entrada' | 'saida'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modals state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isAssemblyReportOpen, setIsAssemblyReportOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<FinancialTransaction | null>(null);

  // Transaction form states
  const [txType, setTxType] = useState<'entrada' | 'saida'>('entrada');
  const [txCategory, setTxCategory] = useState('Dízimo');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txPaymentMethod, setTxPaymentMethod] = useState<FinancialTransaction['paymentMethod']>('PIX');
  const [txMemberId, setTxMemberId] = useState('');
  const [txIsConfidential, setTxIsConfidential] = useState(true);

  // Member form states
  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberMinistry, setMemberMinistry] = useState('Membro da Igreja');
  const [memberBaptized, setMemberBaptized] = useState(true);

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.memberNameCached && t.memberNameCached.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.memberSigiloCode && t.memberSigiloCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.receiptNumber && t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Open add transaction modal
  const openNewTransaction = (defaultType: 'entrada' | 'saida') => {
    setTxType(defaultType);
    setTxCategory(defaultType === 'entrada' ? 'Dízimo' : 'Energia / Água / Utilidades');
    setTxAmount('');
    setTxDescription('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setTxPaymentMethod('PIX');
    setTxMemberId('');
    setTxIsConfidential(true);
    setIsTransactionModalOpen(true);
  };

  // Submit Transaction
  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount.replace(',', '.'));
    if (isNaN(amountNum) || amountNum <= 0) return;

    let memberObj = members.find(m => m.id === txMemberId);

    addTransaction({
      type: txType,
      category: txCategory as any,
      amount: amountNum,
      description: txDescription.trim() || `${txCategory} recebido`,
      date: txDate,
      paymentMethod: txPaymentMethod,
      memberId: memberObj?.id,
      memberSigiloCode: memberObj?.sigiloCode || (txType === 'entrada' ? 'OFERTANTE-AVULSO' : undefined),
      memberNameCached: memberObj?.name,
      isStrictConfidential: txIsConfidential,
      registeredBy: adminSession?.username || 'Tesoureiro Geral'
    });

    setIsTransactionModalOpen(false);
  };

  // Submit Member
  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    addMember({
      name: memberName.trim(),
      phone: memberPhone.trim() || undefined,
      email: memberEmail.trim() || undefined,
      membershipDate: new Date().toISOString().split('T')[0],
      isBaptized: memberBaptized,
      ministryGroup: memberMinistry,
      status: 'ativo'
    });

    setMemberName('');
    setMemberPhone('');
    setMemberEmail('');
    setIsMemberModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Confidentiality Guard */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-white">
              CRM de Dízimos, Ofertas e Tesouraria Eclesiástica
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Controle seguro e sigiloso das finanças da Igreja O Brasil Para Cristo. Os dízimos individuais são protegidos por sigilo canônico e exibidos apenas como código para preservar os fiéis.
          </p>
        </div>

        {/* Confidentiality Toggle & Reports */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSigiloModeActive(!isSigiloModeActive)}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              isSigiloModeActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title="Alternar sigilo de nomes dos dizimistas"
          >
            {isSigiloModeActive ? (
              <>
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Sigilo Ativo (MBR-***)</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-amber-400" />
                <span>Modo Nominal (Revelado)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAssemblyReportOpen(true)}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Balancete Assembleia</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Entradas (Mês Atual)</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {financialSummary.mesAtualEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Saídas (Mês Atual)</span>
            <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
              {financialSummary.mesAtualSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Saldo em Caixa</span>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
              {financialSummary.saldoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Membros Registrados</span>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {members.length} cadastrados
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('livro_caixa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'livro_caixa'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Livro Caixa & Lançamentos ({transactions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('membros')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'membros'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Membros & Contribuintes ({members.length})
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openNewTransaction('entrada')}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Dízimo / Entrada</span>
          </button>
          <button
            onClick={() => openNewTransaction('saida')}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Despesa / Saída</span>
          </button>
          {transactions.length > 0 && activeSubTab === 'livro_caixa' && (
            <button
              onClick={async () => {
                if (window.confirm('Atenção: Deseja realmente zerar o Livro Caixa e apagar todas as entradas e saídas de teste?')) {
                  await clearAllTransactions();
                }
              }}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-300 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
              title="Excluir todas as transações e zerar o saldo"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Zerar Livro Caixa</span>
            </button>
          )}
          {activeSubTab === 'membros' && (
            <>
              <button
                onClick={() => setIsMemberModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-slate-950" />
                <span>Novo Membro</span>
              </button>
              {members.length > 0 && (
                <button
                  onClick={async () => {
                    if (window.confirm('Atenção: Deseja realmente zerar o cadastro de membros e apagar todos os registros de teste MBR? Esta ação não pode ser desfeita.')) {
                      await clearAllMembers();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-300 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
                  title="Excluir todos os membros de teste"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Zerar Membros</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* SUB-VIEW 1: LIVRO CAIXA */}
      {activeSubTab === 'livro_caixa' && (
        <div className="space-y-4">
          
          {/* Filters and search */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por descrição, recibo ou código do membro..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="all">Todas as Movimentações</option>
                <option value="entrada">Apenas Entradas (Dízimos/Ofertas)</option>
                <option value="saida">Apenas Saídas (Despesas/Contas)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Dízimo">Dízimo</option>
                <option value="Oferta de Culto">Oferta de Culto</option>
                <option value="Oferta Missionária">Oferta Missionária</option>
                <option value="Campanha / Construção">Campanha / Construção</option>
                <option value="Energia / Água / Utilidades">Energia / Água</option>
                <option value="Manutenção & Obras">Manutenção</option>
                <option value="Sustento Pastoral">Sustento Pastoral</option>
                <option value="Santa Ceia">Santa Ceia</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Data</th>
                    <th className="py-3.5 px-4">Recibo / ID</th>
                    <th className="py-3.5 px-4">Tipo & Categoria</th>
                    <th className="py-3.5 px-4">Contribuinte / Favorecido</th>
                    <th className="py-3.5 px-4">Forma</th>
                    <th className="py-3.5 px-4 text-right">Valor</th>
                    <th className="py-3.5 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Nenhuma transação encontrada com os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isEntry = tx.type === 'entrada';
                      const displayName = isSigiloModeActive && tx.isStrictConfidential
                        ? (tx.memberSigiloCode || 'MEMBRO EM SIGILO')
                        : (tx.memberNameCached || tx.memberSigiloCode || tx.description);

                      return (
                        <tr key={tx.id} className="hover:bg-slate-850/60 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                            {new Date(tx.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-amber-400 font-semibold">
                            {tx.receiptNumber}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isEntry 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}>
                                {isEntry ? '+ ENTRADA' : '- SAÍDA'}
                              </span>
                              <span className="text-white font-medium">{tx.category}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              {tx.isStrictConfidential && (
                                <Lock className="w-3 h-3 text-amber-400 shrink-0" title="Protegido por Sigilo Pastoral" />
                              )}
                              <span className="font-semibold text-slate-200">{displayName}</span>
                            </div>
                            {tx.description && tx.description !== tx.category && (
                              <span className="text-[10px] text-slate-400 block truncate max-w-xs">{tx.description}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[11px]">
                              {tx.paymentMethod}
                            </span>
                          </td>
                          <td className={`py-3.5 px-4 whitespace-nowrap text-right font-mono font-bold text-sm ${
                            isEntry ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {isEntry ? '+' : '-'} {Number(tx.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {isEntry && (
                                <button
                                  onClick={() => setReceiptToPrint(tx)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                                  title="Emitir Recibo Oficial"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja excluir o lançamento ${tx.receiptNumber}?`)) {
                                    deleteTransaction(tx.id);
                                  }
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                                title="Excluir Lançamento"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-VIEW 2: MEMBROS & CRM */}
      {activeSubTab === 'membros' && (
        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">Nenhum membro cadastrado</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                O cadastro de membros está limpo e pronto para receber os registros reais da igreja.
              </p>
              <button
                onClick={() => setIsMemberModalOpen(true)}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Cadastrar Primeiro Membro</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((mbr) => {
                // Calculate this member's total contributions
                const memberTxs = transactions.filter(t => t.memberId === mbr.id && t.type === 'entrada');
                const totalContributed = memberTxs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
                const lastTx = memberTxs[0];

                return (
                  <div
                    key={mbr.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {mbr.sigiloCode}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          mbr.isBaptized ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {mbr.isBaptized ? 'Batizado' : 'Congregado'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-0.5">
                        {isSigiloModeActive ? mbr.sigiloCode : mbr.name}
                      </h4>
                      {!isSigiloModeActive && (
                        <p className="text-xs text-slate-400">{mbr.phone || 'Sem telefone'} • {mbr.ministryGroup}</p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">Total Dízimos / Ofertas:</span>
                        <strong className="font-mono font-bold text-emerald-400">
                          {totalContributed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </strong>
                      </div>
                      {lastTx && (
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Última contribuição:</span>
                          <span>{new Date(lastTx.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Novo Lançamento Financeiro */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-2xl">
            <button
              onClick={() => setIsTransactionModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {txType === 'entrada' ? (
                <>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>Lançamento de Dízimo / Entrada</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                  <span>Lançamento de Despesa / Saída</span>
                </>
              )}
            </h3>

            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTxType('entrada');
                    setTxCategory('Dízimo');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                    txType === 'entrada'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Entrada (Receita)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTxType('saida');
                    setTxCategory('Energia / Água / Utilidades');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                    txType === 'saida'
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Saída (Despesa)</span>
                </button>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Category & Payment Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {txType === 'entrada' ? (
                      <>
                        <option value="Dízimo">Dízimo</option>
                        <option value="Oferta de Culto">Oferta de Culto</option>
                        <option value="Oferta Missionária">Oferta Missionária</option>
                        <option value="Campanha / Construção">Campanha / Construção</option>
                        <option value="Voto / Ação de Graças">Voto / Ação de Graças</option>
                        <option value="Outras Entradas">Outras Entradas</option>
                      </>
                    ) : (
                      <>
                        <option value="Energia / Água / Utilidades">Energia / Água / Utilidades</option>
                        <option value="Manutenção & Obras">Manutenção & Obras</option>
                        <option value="Missões & Ação Social">Missões & Ação Social</option>
                        <option value="Sustento Pastoral">Sustento Pastoral</option>
                        <option value="Santa Ceia">Santa Ceia</option>
                        <option value="Equipamentos de Som & Mídia">Equipamentos Som/Mídia</option>
                        <option value="Outras Despesas">Outras Despesas</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Forma de Pagamento</label>
                  <select
                    value={txPaymentMethod}
                    onChange={(e) => setTxPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Dinheiro">Dinheiro (Espécie)</option>
                    <option value="Cartão Débito">Cartão Débito</option>
                    <option value="Cartão Crédito">Cartão Crédito</option>
                    <option value="Transferência">Transferência / DOC / TED</option>
                    <option value="Boleto">Boleto Bancário</option>
                  </select>
                </div>
              </div>

              {/* Member association if entrada */}
              {txType === 'entrada' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vincular a Membro Cadastrado</label>
                  <select
                    value={txMemberId}
                    onChange={(e) => setTxMemberId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">-- Contribuição Anônima / Ofertante Avulso --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.sigiloCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição / Histórico</label>
                <input
                  type="text"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder={txType === 'entrada' ? 'Ex: Dízimo referente ao mês corrente' : 'Ex: Pagamento conta de energia sede'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {txType === 'entrada' && (
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={txIsConfidential}
                    onChange={(e) => setTxIsConfidential(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                  />
                  <span>Manter Sob Sigilo Pastoral Estrito (Mascara na visualização pública)</span>
                </label>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransactionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow ${
                    txType === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Novo Membro */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-2xl">
            <button
              onClick={() => setIsMemberModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Cadastrar Novo Membro</span>
            </h3>

            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Ex: João da Silva Santos"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ministério / Cargo</label>
                  <input
                    type="text"
                    value={memberMinistry}
                    onChange={(e) => setMemberMinistry(e.target.value)}
                    placeholder="Ex: Diaconato, Coral, UFEBRAC"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="membro@email.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={memberBaptized}
                  onChange={(e) => setMemberBaptized(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                />
                <span>Membro Batizado nas Águas</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow"
                >
                  Cadastrar Membro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Recibo de Dízimo */}
      {receiptToPrint && (
        <ReceiptPrintModal
          transaction={receiptToPrint}
          onClose={() => setReceiptToPrint(null)}
        />
      )}

      {/* Modal 4: Balancete da Assembleia */}
      {isAssemblyReportOpen && (
        <AssemblyReportModal
          onClose={() => setIsAssemblyReportOpen(false)}
        />
      )}

    </div>
  );
};
