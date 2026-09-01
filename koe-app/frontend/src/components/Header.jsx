import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, left, right, gradient }) {
  const navigate = useNavigate();

  return (
    <header style={{ ...styles.header, ...(gradient ? styles.headerGrad : {}) }}>
      <div style={styles.left}>
        {left === 'back' ? (
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ChevronLeft color={gradient ? 'white' : '#1A1A2E'} />
          </button>
        ) : left === 'close' ? (
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <CloseIcon color="#1A1A2E" />
          </button>
        ) : left || null}
      </div>

      <div style={styles.center}>
        {title === 'KOE' ? (
          <span style={styles.logo} className={gradient ? '' : 'grad-text'}>KOE</span>
        ) : (
          <span style={{ ...styles.titleText, color: gradient ? 'white' : '#1A1A2E' }}>{title}</span>
        )}
      </div>

      <div style={styles.right}>
        {right || null}
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 'var(--header-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerGrad: {
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    borderBottom: 'none',
  },
  left:   { width: 44, display: 'flex', alignItems: 'center' },
  center: { flex: 1, textAlign: 'center' },
  right:  { width: 44, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '0.12em',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 600,
  },
};

export function ChevronLeft({ color = '#1A1A2E' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ color = '#1A1A2E' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon({ color = '#1A1A2E', hasDot }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {hasDot && (
        <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#F093FB', border: '2px solid white' }} />
      )}
    </div>
  );
}

export function MoreIcon({ color = '#1A1A2E' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="5"  r="1.5" fill={color} />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="19" r="1.5" fill={color} />
    </svg>
  );
}
