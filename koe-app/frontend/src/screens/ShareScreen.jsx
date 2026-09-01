import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { api } from '../api/client.js';

const CARD_THEMES = [
  { key: 'purple', grad: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', label: 'パープル' },
  { key: 'sunset', grad: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)', label: 'サンセット' },
  { key: 'ocean',  grad: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)', label: 'オーシャン' },
  { key: 'night',  grad: 'linear-gradient(135deg, #1A1A2E 0%, #533483 100%)', label: 'ナイト' },
];

const SHARE_CHANNELS = [
  { label: 'Xでシェア',  icon: XIcon,        color: '#000000' },
  { label: 'LINE',       icon: LineIcon,      color: '#06C755' },
  { label: 'Instagram',  icon: InstaIcon,     color: '#E1306C' },
  { label: 'その他',     icon: MoreShareIcon, color: '#6B7280' },
];

const FALLBACK_POST = {
  id: '1', name: 'みお', username: 'mio_98',
  era: '1998年生まれ', ageLabel: '26歳', birthYear: 1998,
  text: 'ふと、思ったこと。\n将来のことを考えると、\n不安になるけど、\nそれ以上にワクワクしてる。',
  tags: ['#将来のこと', '#モヤモヤ'],
  resonances: 128, comments: 23, shares: 12,
};

export default function ShareScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [theme, setTheme] = useState('purple');

  useEffect(() => {
    api.getPost(id)
      .then(setPost)
      .catch(() => setPost(FALLBACK_POST));
  }, [id]);

  if (!post) return null;
  const currentTheme = CARD_THEMES.find(t => t.key === theme);

  return (
    <div style={styles.container}>
      <Header title="シェアカード" left="close" />

      <div className="screen">
        {/* Card preview */}
        <div style={styles.previewWrap}>
          <div style={{ ...styles.shareCard, background: currentTheme.grad }}>
            <div style={styles.cardHeader}>
              <span style={styles.koeLabel}>KOE</span>
            </div>
            <div style={styles.cardUserRow}>
              <div style={{ ...styles.cardAvatar }}>
                {(post.name || '?')[0]}
              </div>
              <div>
                <p style={styles.cardName}>{post.name}</p>
                <p style={styles.cardEra}>{post.era}・{post.ageLabel}</p>
              </div>
            </div>
            <p style={styles.cardText}>{post.text}</p>
            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                {post.tags.map(t => (
                  <span key={t} style={styles.cardTag}>{t}</span>
                ))}
              </div>
            )}
            <div style={styles.cardStats}>
              <span style={styles.cardStat}>♡ {post.resonances}</span>
              <span style={styles.cardStat}>💬 {post.comments}</span>
              <span style={styles.cardStat}>⇄ {post.shares}</span>
            </div>
            <p style={styles.cardFooter}>あなたの声が、時を超えて届く</p>
          </div>
        </div>

        {/* Theme selector */}
        <div style={styles.themeSection}>
          <p style={styles.sectionLabel}>カードのテーマ</p>
          <div style={styles.themeRow}>
            {CARD_THEMES.map(t => (
              <button
                key={t.key}
                style={{ ...styles.themeBtn, background: t.grad, ...(theme === t.key ? styles.themeBtnActive : {}) }}
                onClick={() => setTheme(t.key)}
              >
                {theme === t.key && <span style={styles.checkmark}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Share channels */}
        <div style={styles.shareSection}>
          <p style={styles.sectionLabel}>シェア先を選択</p>
          <div style={styles.channelGrid}>
            {SHARE_CHANNELS.map(({ label, icon: Icon, color }) => (
              <button key={label} style={styles.channelBtn}>
                <div style={{ ...styles.channelIcon, background: color }}>
                  <Icon />
                </div>
                <span style={styles.channelLabel}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Copy link */}
        <div style={styles.copySection}>
          <div style={styles.copyRow}>
            <span style={styles.copyUrl}>https://koe.app/post/{post.id}</span>
            <button style={styles.copyBtn}>コピー</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  previewWrap: {
    padding: 20, display: 'flex', justifyContent: 'center',
    background: '#F8F7FF',
  },
  shareCard: {
    width: '100%', maxWidth: 320, borderRadius: 20, padding: '20px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
  },
  cardHeader: { marginBottom: 14 },
  koeLabel: { fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '0.15em' },
  cardUserRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  cardAvatar: {
    width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: 15, fontWeight: 700,
  },
  cardName: { fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 },
  cardEra: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  cardText: { fontSize: 16, fontWeight: 500, color: 'white', lineHeight: 1.7, whiteSpace: 'pre-line' },
  cardTag: {
    fontSize: 11, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.18)',
    padding: '2px 9px', borderRadius: 20,
  },
  cardStats: { display: 'flex', gap: 12, marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.2)' },
  cardStat: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  cardFooter: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 12, fontStyle: 'italic' },
  themeSection: { padding: '16px' },
  sectionLabel: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' },
  themeRow: { display: 'flex', gap: 12 },
  themeBtn: {
    width: 44, height: 44, borderRadius: '50%', border: '2px solid transparent',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.15s',
  },
  themeBtnActive: { border: '2.5px solid #1A1A2E', transform: 'scale(1.1)' },
  checkmark: { color: 'white', fontSize: 16, fontWeight: 700 },
  shareSection: { padding: '0 16px 16px' },
  channelGrid: { display: 'flex', gap: 16 },
  channelBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
  channelIcon: { width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  channelLabel: { fontSize: 11, color: 'var(--text-secondary)' },
  copySection: { padding: '0 16px 24px' },
  copyRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#F8F7FF', borderRadius: 10, padding: '10px 12px',
    border: '1px solid var(--border)',
  },
  copyUrl: { flex: 1, fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  copyBtn: {
    padding: '5px 14px', borderRadius: 20, background: 'linear-gradient(135deg, #667EEA, #764BA2)',
    color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
  },
};

function XIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.634L18.244 2.25z"/></svg>;
}
function LineIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 5.9 2 10.7c0 2.7 1.4 5.1 3.6 6.7-.1.5-.5 1.8-.6 2.1-.1.3.1.6.4.5.2 0 3-1.9 3.8-2.4.8.1 1.7.2 2.6.2 5.52 0 10-3.9 10-8.7C22 5.9 17.52 2 12 2zm-4 11H6v-5h2v5zm4 0h-2V8h2v5zm4 0h-2v-5h2v5z"/></svg>;
}
function InstaIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8" fill="none"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" fill="none"/><circle cx="17.5" cy="6.5" r="1" fill="white"/></svg>;
}
function MoreShareIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><circle cx="5" cy="12" r="2" fill="white"/><circle cx="12" cy="12" r="2" fill="white"/><circle cx="19" cy="12" r="2" fill="white"/></svg>;
}
