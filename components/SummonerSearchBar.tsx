'use client';

import React, { useState, FormEvent } from 'react';

interface Props {
  onSearch: (name: string) => void;
}

export const SummonerSearchBar: React.FC<Props> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Riot ID (ex: Odyoz#EUW)"
        style={{
          flex: 1,
          background: '#111827',
          borderRadius: '9999px',
          border: '1px solid #1f2937',
          padding: '10px 14px',
          color: '#f9fafb',
        }}
      />
      <button
        type="submit"
        style={{
          borderRadius: '9999px',
          padding: '10px 18px',
          border: 'none',
          background: '#3b82f6',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Go
      </button>
    </form>
  );
};
