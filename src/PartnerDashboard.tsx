import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function PartnerDashboard() {
  const [docType, setDocType] = useState('MEI');
  const [docNumber, setDocNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegisterStore(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          commercial_name: storeName,
          document_type: docType,
          document_number: docNumber,
          role: 'partner',
          status: 'pending'
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Dados da empresa submetidos com sucesso para aprovação!');
    } catch (err) {
      console.error('Erro ao registar empresa:', err);
      alert('Erro ao submeter dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl mt-6">
      <h2 className="text-xl font-black text-amber-400 mb-2">Painel do Parceiro - IbiapabaExpress</h2>
      <p className="text-xs text-slate-400 mb-6">Registe o seu negócio e faça a gestão dos seus produtos para os clientes da serra.</p>

      {/* Formulário de Dados Comerciais */}
      <form onSubmit={handleRegisterStore} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">1. Dados do Estabelecimento / Prestador</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Nome do Negócio / Loja</label>
            <input 
              type="text" 
              value={storeName} 
              onChange={(e) => setStoreName(e.target.value)} 
              placeholder="Ex: Oficina do João / Lanches da Serra"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Tipo de Identificação</label>
            <select 
              value={docType} 
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm"
            >
              <option value="MEI">MEI (Microempreendedor Individual)</option>
              <option value="CNPJ">CNPJ (Empresa)</option>
              <option value="CPF">CPF (Autónomo / Entregador / Prestador)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Número do Documento ({docType})</label>
          <input 
            type="text" 
            value={docNumber} 
            onChange={(e) => setDocNumber(e.target.value)} 
            placeholder={docType === 'CPF' ? '000.000.000-00' : '00.000.000/0001-00'}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors"
        >
          {loading ? 'A guardar...' : 'Guardar e Solicitar Aprovação'}
        </button>
      </form>

      {/* Gestão / Cadastro de Produtos (Exemplo Visual) */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">2. Adicionar Produto ou Serviço ao Catálogo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input 
            type="text" 
            placeholder="Nome do Produto" 
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm"
          />
          <input 
            type="text" 
            placeholder="Preço (R$)" 
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm"
          />
          <input 
            type="text" 
            placeholder="Especificações / Detalhes" 
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm"
          />
        </div>
        <button 
          onClick={() => alert('Produto adicionado ao catálogo local com sucesso!')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
        >
          Publicar Produto na Montra
        </button>
      </div>
    </div>
  );
}

