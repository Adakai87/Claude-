import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',              label: 'ホーム',    icon: HomeIcon },
  { path: '/search',        label: '検索',      icon: SearchIcon },
  { path: '/post',          label: null,        icon: PlusIcon, isPost: true },
  { path: '/notifications', label: '通知',      icon: BellIcon },
  { path: '/profile',       label: 'プロフィール', icon: PersonIcon },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav style={styles.nav}>
      {NAV_ITEMS.map(({ path, label, icon: Icon, isPost }) => {
        const active = pathname === path;
        if (isPost) {
          return (
            <button key={path} style={styles.postBtn} onClick={() => navigate(path)}>
              <PlusIcon />
            </button>
          );
        }
        return (
          <button
            key={path}
            style={{ ...styles.item, ...(active ? styles.itemActive : {}) }}
            onClick={() => navigate(path)}
          >
            <Icon color={active ? '#764BA2' : '#9CA3AF'} />
            <span style={{ ...styles.label, color: active ? '#764BA2' : '#9CA3AF', fontWeight: active ? 600 : 400 }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    height: 'var(--nav-height)',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 'env(safe-area-inset-bottom)',
    flexShrink: 0,
    zIndex: 100,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 8,
    minWidth: 52,
    transition: 'opacity 0.15s',
  },
  itemActive: {},
  postBtn: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(102,126,234,0.45)',
    marginTop: -16,
    transition: 'transform 0.1s',
  },
  label: {
    fontSize: 10,
    letterSpacing: '0.01em',
  },
};

function HomeIcon({ color = '#9CA3AF' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ color = '#9CA3AF' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" />
      <path d="M16.5 16.5L21 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ color = '#9CA3AF' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PersonIcon({ color = '#9CA3AF' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
