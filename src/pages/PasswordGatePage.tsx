import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const REQUIRED_PASSWORD = 'IntegratedClearance';

export default function PasswordGatePage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      setError(false);
      navigate('/login');
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-[20px] py-[40px]"
      style={{ background: '#f8fafd', fontFamily: "'Dubai', sans-serif" }}
    >
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-[640px] rounded-[16px] flex flex-col items-center px-[80px] py-[64px]"
        style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}
      >
        {/* Key icon */}
        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="#5045E6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mb-[24px]">
          <circle cx="22" cy="42" r="11" />
          <path d="M30 34 L52 12" />
          <path d="M44 20 L50 26" />
          <path d="M48 16 L54 22" />
        </svg>

        <h1 className="text-[32px] text-[#0e1b3d] text-center mb-[12px]" style={{ fontWeight: 600 }}>
          Password required
        </h1>
        <p className="text-[16px] text-[#455174] text-center">
          You need a password to access the Make file
        </p>
        <p className="text-[16px] text-[#0e1b3d] text-center mb-[28px]" style={{ fontWeight: 600 }}>
          Refunds and claims
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (error) setError(false); }}
          placeholder="Enter password"
          autoFocus
          className="w-full rounded-[10px] px-[20px] py-[16px] text-[16px] focus:outline-none transition-colors"
          style={{
            background: '#f1f1f3',
            color: '#0e1b3d',
            border: `1px solid ${error ? '#dc3545' : 'transparent'}`,
          }}
          aria-invalid={error}
        />
        {error && (
          <p className="self-start text-[13px] text-[#dc3545] mt-[8px]">Incorrect password — please try again.</p>
        )}

        <button
          type="submit"
          className="w-full mt-[20px] rounded-[10px] py-[14px] text-white text-[16px] hover:opacity-90 transition-opacity"
          style={{ background: '#5045E6', fontWeight: 600 }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
