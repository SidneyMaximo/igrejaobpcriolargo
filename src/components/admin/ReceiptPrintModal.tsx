import React from 'react';
import { X, Printer, Check, Church, ShieldCheck, Download, Heart } from 'lucide-react';
import { FinancialTransaction } from '../../types';
import { useChurch } from '../../context/ChurchContext';

interface ReceiptPrintModalProps {
  transaction: FinancialTransaction;
  onClose: () => void;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  transaction,
  onClose
}) => {
  const { churchInfo, isSigiloModeActive } = useChurch();

  const handlePrint = () => {
    window.print();
  };

  const displayName = isSigiloModeActive && transaction.isStrictConfidential
    ? (transaction.memberSigiloCode || 'MEMBRO EM SIGILO PASTORAL')
    : (transaction.memberNameCached || transaction.memberSigiloCode || 'Ofertante Anônimo');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Actions header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Comprovante Oficial de Contribuição Eclesiástica
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Receipt Box */}
        <div 
          id="printable-receipt-card"
          className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-slate-200 shadow-inner font-sans"
        >
          {/* Church Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Church className="w-6 h-6 text-amber-600" />
                <h3 className="font-serif font-black text-lg text-slate-900 uppercase tracking-tight">
                  {churchInfo.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                {churchInfo.address} • {churchInfo.cityState}
              </p>
              <p className="text-[10px] text-slate-500">
                CNPJ / Chave PIX: {churchInfo.pixKey} • Tel: {churchInfo.phone}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Número do Recibo</span>
              <span className="text-sm font-mono font-black text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                {transaction.receiptNumber}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-800">
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-amber-800 block">Valor Recolhido</span>
                <span className="text-2xl font-black font-mono text-slate-950">
                  {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-amber-200 text-amber-900 rounded-lg">
                {transaction.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Contribuinte / Doador:</span>
                <strong className="text-slate-900 text-sm font-semibold">{displayName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Data de Entrada:</span>
                <strong className="text-slate-900 text-sm font-semibold">
                  {new Date(transaction.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Forma de Pagamento:</span>
                <strong className="text-slate-900 font-semibold">{transaction.paymentMethod}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Responsável pelo Registro:</span>
                <strong className="text-slate-900 font-semibold">{transaction.registeredBy}</strong>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="text-slate-500 block text-[11px] mb-1">Histórico / Descrição:</span>
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                {transaction.description}
              </p>
            </div>

            {/* Scripture & Seal */}
            <div className="pt-4 mt-4 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="text-[10px] text-slate-500 italic max-w-xs">
                  "Trazei todos os dízimos à casa do tesouro... e fazei prova de mim, diz o Senhor." (Ml 3:10)
                </p>
                <span className="text-[9px] text-slate-400 block mt-1">
                  Documento emitido eletronicamente pela Tesouraria OBPC sob sigilo canônico.
                </span>
              </div>

              <div className="text-center shrink-0">
                <div className="w-32 border-b border-slate-400 pb-1 mb-1">
                  <span className="text-[9px] text-slate-400 font-mono">Assinatura Eletrônica</span>
                </div>
                <span className="text-[10px] font-bold text-slate-700 uppercase">Tesouraria Geral</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
