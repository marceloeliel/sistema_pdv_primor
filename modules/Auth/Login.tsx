
import React, { useState } from 'react';
import { User } from '../../types';
import { SYSTEM_USERS } from '../../constants';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = SYSTEM_USERS.find(u => u.username === username);
    if (found) onLogin(found);
    else alert('Usuário não encontrado. Use: admin, caixa1 ou cozinha1');
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic text-brand-red tracking-tighter">PRIMOR</h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-yellow mt-1">Salgados & Delivery</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-gray-50 border-gray-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-brand-yellow focus:border-brand-yellow"
              placeholder="Digite seu usuário..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-gray-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-brand-yellow focus:border-brand-yellow"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-red text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-red/20 active:scale-95 transition-all"
          >
            ENTRAR NO SISTEMA
          </button>
        </form>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Acesso Rápido (Demo)</p>
          <div className="flex justify-center gap-4 mt-4">
            {SYSTEM_USERS.map(u => (
              <button
                key={u.id}
                onClick={() => setUsername(u.username)}
                className="text-[10px] font-black text-brand-red hover:underline"
              >
                {u.username.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
