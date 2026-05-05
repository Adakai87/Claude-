import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { api } from '../api/client.js';

const FALLBACK_TODAY = {
  fromEra: '1970年代生まれ', fromAgeLabel: '50代', toEra: '20代',
  text: '「大丈夫。\nなんとかなるよ、\nきっと。」',
  username: 'jun_70s',
  pastMessages: [
    { id: 'p1', text: '若さは最強の武器。', fromEra: '60代', date: '5/17' },
    { id: 'p2', text: '失敗を恐れるな。', fromEra: '40代', date: '5/16' },
    { id: 'p3', text: '今この瞬間を大事に。', fromEra: '50代', date: '5/15' },
  ],
};

export default function TodayScreen() {
  const navigate = useNavigate();
  const [today, setToday] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    api.getToday()
      .then(setToday)
      .catch(() => setToday(FALLBACK_TODAY));
  }, []);

  if (!today) return null;

  return (
    <div style={styles.container}>
      <Header title="今日の1通" left="back" right={<InfoIcon />} />

      <div className="screen">
        {/* Header subtitle */}
        <p style={styles.subtitle}>
          {today.fromEra}のあなたから<br />
          {today.toEra}のあなたへ
        </p>

        {/* Main card */}
        <div style={styles.mainCard} onClick={() => setRevealed(true)}>
          <div style={styles.mainCardInner}>
            <div style={styles.fromBadge}>
              <span style={styles.fromBadgeText}>{today.fromEra}・{today.fromAgeLabel}</span>
            </div>
            <p style={styles.mainText}>{today.text}</p>
            {!revealed ? (
              <div style={styles.tapHint}>
                <span style={styles.tapText}>タップして開く</span>
                <div style={styles.tapPulse} />
              </div>
            ) : (
              <div style={styles.revealedActions}>
                <button style={styles.resonateBtn} onClick={(e) => e.stopPropagation()}>
                  <HeartWhiteIcon />
                  <span>共鳴する</span>
                </button>
                <button style={styles.shareBtn} onClick={(e) => e.stopPropagation()}>
                  シェア
                </button>
              </div>
            )}
          </div>

          {/* Decorative stars */}
          <div style={{ ...styles.star, top: '15%', right: '12%', fontSize: 18 }}>✦</div>
          <div style={{ ...styles.star, bottom: '25%', left: '8%', fontSize: 12, opacity: 0.5 }}>✦</div>
          <div style={{ ...styles.star, top: '50%', right: '6%', fontSize: 10, opacity: 0.4 }}>✦</div>
        </div>

        {/* Context */}
        <div style={styles.contextSection}>
          <p style={styles.contextText}>
            「時を越えて届いた言葉に、<br />心が動いたら共鳴してみよう。」
          </p>
        </div>

        {/* Past messages */}
        <div style={styles.pastSection}>
          <p style={styles.pastTitle}>過去の今日の1通</p>
          <div style={styles.pastGrid}>
            {today.pastMessages.map(msg => (
              <div key={msg.id} style={styles.pastCard}>
                <p style={styles.pastDate}>{msg.date}</p>
                <p style={styles.pastText}>{msg.text}</p>
                <p style={styles.pastFrom}>{msg.fromEra}より</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  subtitle: {
    textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)',
    lineHeight: 1.7, padding: '16px 24px 8px',
  },
  mainCard: {
    margin: '12px 16px',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 40%, #0F3460 80%, #533483 100%)',
    borderRadius: 20, padding: '32px 24px', cursor: 'pointer',
    position: 'relative', overflow: 'hidden', minHeight: 280,
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  mainCardInner: { position: 'relative', zIndex: 1 },
  fromBadge: {
    display: 'inline-block', padding: '4px 12px',
    background: 'rgba(255,255,255,0.12)', borderRadius: 20, marginBottom: 20,
  },
  fromBadgeText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 },
  mainText: {
    fontSize: 26, fontWeight: 700, color: 'white', lineHeight: 1.6,
    whiteSpace: 'pre-line', marginBottom: 28, letterSpacing: '0.02em',
  },
  tapHint: { display: 'flex', alignItems: 'center', gap: 10 },
  tapText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' },
  tapPulse: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'rgba(240,147,251,0.7)',
    boxShadow: '0 0 0 4px rgba(240,147,251,0.2)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  revealedActions: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  resonateBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 20px', borderRadius: 20, border: 'none',
    background: 'rgba(240,147,251,0.25)', color: 'white',
    fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  shareBtn: {
    padding: '10px 20px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
    color: 'white', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
  },
  star: { position: 'absolute', color: 'rgba(255,255,255,0.6)', lineHeight: 1 },
  contextSection: {
    margin: '0 16px', padding: '16px', background: 'var(--gradient-soft)',
    borderRadius: 12, border: '1px solid rgba(118,75,162,0.12)',
  },
  contextText: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, textAlign: 'center' },
  pastSection: { padding: '16px' },
  pastTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 },
  pastGrid: { display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' },
  pastCard: {
    minWidth: 130, padding: '14px', borderRadius: 14,
    background: 'linear-gradient(135deg, #2D1B69, #11998e)',
    flexShrink: 0, cursor: 'pointer',
  },
  pastDate: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  pastText: { fontSize: 13, color: 'white', fontWeight: 500, lineHeight: 1.5, marginBottom: 10 },
  pastFrom: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
};

function InfoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.8" />
      <path d="M12 8v4M12 16h.01" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartWhiteIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
}
