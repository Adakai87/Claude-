import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { api, currentUser } from '../api/client.js';

const TARGET_OPTIONS = [
  { key: 'future', label: '未来の自分へ（すべての世代へ）' },
  { key: 'youth',  label: '若い世代へ' },
  { key: 'all',    label: 'すべての人へ' },
];

export default function TimeCapsuleScreen() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [deliverAt, setDeliverAt] = useState('');
  const [targetEra, setTargetEra] = useState('future');
  const [capsules, setCapsules] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() + 3);
    setDeliverAt(defaultDate.toISOString().split('T')[0]);

    api.getTimecapsules()
      .then(setCapsules)
      .catch(() => setCapsules(FALLBACK_CAPSULES));
  }, []);

  const handleSend = async () => {
    if (!text.trim() || !deliverAt || sending) return;
    setSending(true);
    try {
      const tc = await api.createTimecapsule({ text: text.trim(), deliverAt, targetEra });
      setCapsules(c => [tc, ...c]);
      setText('');
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (_) {}
    setSending(false);
  };

  const MAX = 140;
  const remaining = MAX - text.length;

  return (
    <div style={styles.container}>
      <Header title="タイムカプセル" left="back" />

      <div className="screen">
        {/* Header illustration */}
        <div style={styles.hero}>
          <div style={styles.heroGrad} />
          <div style={styles.heroContent}>
            <p style={styles.heroTitle}>未来の自分へ声を残そう</p>
            <p style={styles.heroSub}>設定した日に、通知でお届けします</p>
          </div>
          <div style={styles.clockIcon}><ClockIcon /></div>
        </div>

        {sent && (
          <div style={styles.successBanner} className="fade-in">
            ✦ タイムカプセルを保存しました
          </div>
        )}

        {/* Compose */}
        <div style={styles.section}>
          <p style={styles.label}>メッセージ</p>
          <div style={styles.textareaWrap}>
            <textarea
              style={styles.textarea}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={'3年後の自分へ。\nその時のあなたに、\n伝えたいことを。'}
              maxLength={MAX + 10}
            />
            <span style={{ ...styles.counter, color: remaining < 10 ? '#EF4444' : 'var(--text-muted)' }}>
              {remaining}
            </span>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Delivery date */}
        <div style={styles.section}>
          <p style={styles.label}>届く日を設定</p>
          <div style={styles.dateRow}>
            <CalendarIcon />
            <input
              type="date"
              style={styles.dateInput}
              value={deliverAt}
              onChange={e => setDeliverAt(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <p style={styles.dateHint}>
            {deliverAt ? `${deliverAt.replace(/-/g, '/')} に届けます` : '日付を選んでください'}
          </p>
        </div>

        <div style={styles.divider} />

        {/* Target */}
        <div style={styles.section}>
          <p style={styles.label}>誰に届ける？（任意）</p>
          {TARGET_OPTIONS.map(opt => (
            <label key={opt.key} style={styles.optionRow} onClick={() => setTargetEra(opt.key)}>
              <div style={{ ...styles.radio, ...(targetEra === opt.key ? styles.radioActive : {}) }}>
                {targetEra === opt.key && <div style={styles.radioDot} />}
              </div>
              <span style={{ ...styles.optionLabel, color: targetEra === opt.key ? '#764BA2' : 'var(--text-primary)' }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>

        {/* Submit */}
        <div style={styles.submitSection}>
          <button
            className="btn-grad"
            style={{ opacity: text.trim() && deliverAt ? 1 : 0.45 }}
            disabled={!text.trim() || !deliverAt || sending}
            onClick={handleSend}
          >
            {sending ? '保存中...' : 'タイムカプセルに入れる'}
          </button>
          <p style={styles.hint}>※ 設定した日に、通知でお届けします</p>
        </div>

        {/* Existing capsules */}
        {capsules.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionDivider} />
            <p style={styles.label}>保存済みのカプセル</p>
            {capsules.map(tc => (
              <CapsuleItem key={tc.id} capsule={tc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CapsuleItem({ capsule }) {
  return (
    <div style={styles.capsuleItem}>
      <div style={styles.capsuleIcon}><ClockSmallIcon /></div>
      <div style={{ flex: 1 }}>
        <p style={styles.capsuleText} numberOfLines={2}>{capsule.text}</p>
        <p style={styles.capsuleDate}>📅 {capsule.deliverAt?.replace(/-/g, '/')} 届け予定</p>
      </div>
      <div style={styles.capsuleStatus}>
        <span style={styles.pendingLabel}>準備中</span>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  hero: {
    margin: 16, borderRadius: 20, overflow: 'hidden', height: 140,
    position: 'relative', display: 'flex', alignItems: 'flex-end',
  },
  heroGrad: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, #1A1A2E 0%, #533483 60%, #764BA2 100%)',
  },
  heroContent: { position: 'relative', zIndex: 1, padding: '0 20px 20px' },
  heroTitle: { fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  clockIcon: {
    position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
    opacity: 0.4,
  },
  successBanner: {
    margin: '0 16px 8px', padding: '12px 16px',
    background: 'linear-gradient(135deg, rgba(102,126,234,0.12), rgba(240,147,251,0.12))',
    border: '1px solid rgba(118,75,162,0.2)', borderRadius: 12,
    fontSize: 14, fontWeight: 600, color: '#764BA2', textAlign: 'center',
  },
  section: { padding: '16px' },
  label: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' },
  textareaWrap: { position: 'relative' },
  textarea: {
    width: '100%', minHeight: 120, border: '1.5px solid var(--border)',
    borderRadius: 12, padding: '12px 14px', fontSize: 15, lineHeight: 1.7,
    fontFamily: 'inherit', color: 'var(--text-primary)', background: '#F8F7FF',
    outline: 'none', resize: 'none',
  },
  counter: { position: 'absolute', bottom: 10, right: 12, fontSize: 12 },
  divider: { height: 8, background: '#F8F7FF' },
  dateRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', background: '#F8F7FF',
    borderRadius: 12, border: '1.5px solid var(--border)',
  },
  dateInput: {
    border: 'none', outline: 'none', background: 'transparent',
    fontSize: 15, fontFamily: 'inherit', color: 'var(--text-primary)', flex: 1,
  },
  dateHint: { fontSize: 12, color: '#764BA2', marginTop: 8, fontWeight: 500 },
  optionRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', cursor: 'pointer' },
  radio: {
    width: 20, height: 20, borderRadius: '50%', border: '2px solid #D1D5DB',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  radioActive: { borderColor: '#764BA2' },
  radioDot: { width: 10, height: 10, borderRadius: '50%', background: '#764BA2' },
  optionLabel: { fontSize: 14 },
  submitSection: { padding: '0 16px 16px' },
  hint: { fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 },
  sectionDivider: { height: 1, background: 'var(--border)', margin: '0 0 16px' },
  capsuleItem: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px', background: '#F8F7FF', borderRadius: 12,
    marginBottom: 10, border: '1px solid var(--border)',
  },
  capsuleIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'linear-gradient(135deg, #667EEA, #764BA2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  capsuleText: { fontSize: 14, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.5 },
  capsuleDate: { fontSize: 12, color: 'var(--text-muted)' },
  capsuleStatus: { flexShrink: 0 },
  pendingLabel: {
    fontSize: 11, fontWeight: 600, color: '#764BA2',
    background: 'rgba(118,75,162,0.08)', padding: '3px 8px', borderRadius: 10,
  },
};

function ClockIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockSmallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
      <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#764BA2" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="#764BA2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const FALLBACK_CAPSULES = [
  {
    id: 'tc1', text: '3年後の自分へ。\nその時のあなたに、\n伝えたいことを。',
    deliverAt: '2027-05-18', targetEra: 'future', status: 'pending',
  },
];
