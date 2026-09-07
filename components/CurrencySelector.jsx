'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from './CurrencyContext';

export default function CurrencySelector({ compact = false }) {
  const { currency, currencyData, setCurrency, currencies, isPpp } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--card-border)',
          borderRadius: '9999px',
          padding: compact ? '4px 10px' : '6px 12px',
          color: '#f8fafc',
          fontSize: compact ? '11.5px' : '12.5px',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          outline: 'none',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'var(--card-border)';
        }}
        title="Change display currency"
      >
        <span>{currencyData.flag}</span>
        <span>{currencyData.code} ({currencyData.symbol})</span>
        <span style={{ fontSize: '9px', opacity: 0.7, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▼</span>
      </button>

      {isPpp && !compact && (
        <span
          className="pill-badge emerald"
          style={{ fontSize: '10px', padding: '2px 7px', whiteSpace: 'nowrap' }}
          title="Purchasing power parity regional pricing is applied for your area"
        >
          ⚡ Regional Pricing Applied
        </span>
      )}

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: '#0a0e1a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            minWidth: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ padding: '6px 10px', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Select Display Currency
          </div>
          {Object.values(currencies).map((curr) => {
            const isSelected = curr.code === currency;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => {
                  setCurrency(curr.code);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>{curr.flag}</span>
                  <span>{curr.name}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11px', color: isSelected ? '#a5b4fc' : 'var(--text-dim)' }}>
                  {curr.symbol}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
