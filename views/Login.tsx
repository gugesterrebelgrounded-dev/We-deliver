
import React from 'react';
import { useStore } from '../store';
import { MOCK_USERS } from '../constants';

const Login: React.FC = () => {
  const { login } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-10 border border-white/10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl ring-8 ring-blue-500/20">
            <span className="text-white font-black text-4xl italic">S</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">SwiftDrop SA</h2>
          <p className="text-slate-400 mt-2 font-medium">Enterprise Marketplace Portal</p>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-500 text-center uppercase tracking-[0.3em] mb-6">Identity Selection</p>
          {MOCK_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => login(user.email)}
              className="w-full flex items-center justify-between px-8 py-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-blue-600 hover:border-blue-500 transition-all group active:scale-95"
            >
              <div className="text-left">
                <p className="font-black text-white text-lg tracking-tight group-hover:translate-x-1 transition-transform">{user.name}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-100">{user.role.replace('_', ' ')}</p>
              </div>
              <div className="text-white opacity-40 group-hover:opacity-100 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-50">
            Secure Multi-Tenant Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
