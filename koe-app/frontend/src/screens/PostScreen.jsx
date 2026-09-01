import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, currentUser } from '../api/client.js';
import { CloseIcon } from '../components/Header.jsx';

const TARGET_ERAS = [
  { key: 'all',    label: 'すべての世代へ' },
  { key: 'teen',   label: '10代へ' },
  { key: 'twenty', label: '20代へ' },
  { key: 'thirty', label: '30代へ' },
  { key: 'forty',  label: '40代へ' },
  { key: 'fifty',  label: '50代以上へ' },
];

const SUGGESTED_TAGS = ['#将来のこと', '#恋愛', '#仕事', '#人生', '#夢', '#家族', '#モヤモヤ', '#感謝'];

const PLACEHOLDERS = [
  '今感じていることを、声に残してみよう。',
  '10年後の自分に一言。',
  '他の世代に聞いてみたいことは？',
  'いつか誰かの心に届く言葉を。',
];

export default function PostScreen() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [targetEra, setTargetEra] = useState('all');
  const [tags, setTags] = useState([]);
  const [posting, setPosting] = useState(false);
  const [placeholder] = useState(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);

  const MAX = 140;
  const remaining = MAX - text.length;
  const canPost = text.trim().length > 0 && text.length <= MAX;

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else if (tags.length < 3) {
      setTags([...tags, tag]);
    }
  };

  const handlePost = async () => {
    if (!canPost || posting) return;
    setPosting(true);
    try {
      await api.createPost({
        text: text.trim(),
        era: currentUser.era,
        ageLabel: currentUser.ageLabel,
        birthYear: currentUser.birthYear,
        targetEra,
        tags,
        userId: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
      });
      navigate('/');
    } catch (_) {
      setPosting(false);
    }
  };

  return (
    <div style={styles.container} className="slide-up">
      {/* Header */}
      <div style={styles.header}>
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <CloseIcon />
        </button>
        <span style={styles.headerTitle}>声を残す</span>
        <button
          style={{ ...styles.nextBtn, opacity: canPost ? 1 : 0.4 }}
          disabled={!canPost}
          onClick={handlePost}
        >
          {posting ? '送信中...' : '次へ'}
        </button>
      </div>

      <div className="screen" style={{ paddingBottom: 120 }}>
        {/* Text area */}
        <div style={styles.textSection}>
          <p style={styles.prompt}>どんな「声」を残しますか？</p>
          <textarea
            style={styles.textarea}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={placeholder}
            maxLength={MAX + 10}
            autoFocus
          />
          <div style={styles.counterRow}>
            <span style={{ ...styles.counter, color: remaining < 0 ? '#EF4444' : remaining < 20 ? '#F59E0B' : 'var(--text-muted)' }}>
              {remaining}
            </span>
            <span style={styles.counter}>/140</span>
          </div>
        </div>

        <div style={styles.divider} />

        {/* My era */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>あなたの年代</p>
          <div style={styles.eraChip}>
            <span style={styles.eraChipText}>{currentUser.era}・{currentUser.ageLabel}</span>
            <span style={styles.eraChipArrow}>›</span>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Target era */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>届けたい世代（任意）</p>
          <div style={styles.eraGrid}>
            {TARGET_ERAS.map(era => (
              <label key={era.key} style={styles.eraOption}>
                <div style={{ ...styles.radioCircle, ...(targetEra === era.key ? styles.radioCircleActive : {}) }}>
                  {targetEra === era.key && <div style={styles.radioInner} />}
                </div>
                <span
                  style={{ ...styles.eraLabel, color: targetEra === era.key ? '#764BA2' : 'var(--text-primary)' }}
                  onClick={() => setTargetEra(era.key)}
                >
                  {era.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={styles.divider} />

        {/* Tags */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>テーマタグ（任意・最大3つ）</p>
          <div style={styles.tagGrid}>
            {SUGGESTED_TAGS.map(tag => (
              <button
                key={tag}
                style={{ ...styles.tagChip, ...(tags.includes(tag) ? styles.tagChipActive : {}) }}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          {tags.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>選択中</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom post button */}
      <div style={styles.bottomAction}>
        <button
          className="btn-grad"
          disabled={!canPost || posting}
          style={{ opacity: canPost ? 1 : 0.45 }}
          onClick={handlePost}
        >
          {posting ? '送信中...' : '声を残す'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'white',
    overflow: 'hidden',
  },
  header: {
    height: 'var(--header-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  nextBtn: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    color: '#764BA2',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  textSection: {
    padding: '20px 16px 12px',
  },
  prompt: {
    fontSize: 14,
    color: 'var(--text-muted)',
    marginBottom: 12,
    fontWeight: 400,
  },
  textarea: {
    width: '100%',
    minHeight: 120,
    border: 'none',
    outline: 'none',
    fontSize: 16,
    lineHeight: 1.75,
    color: 'var(--text-primary)',
    resize: 'none',
    fontFamily: 'inherit',
    background: 'transparent',
  },
  counterRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2,
    marginTop: 8,
  },
  counter: {
    fontSize: 13,
    color: 'var(--text-muted)',
  },
  divider: {
    height: 8,
    background: '#F8F7FF',
  },
  section: {
    padding: '16px',
  },
  sectionLabel: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontWeight: 500,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  eraChip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    background: '#F8F7FF',
    borderRadius: 12,
    cursor: 'pointer',
  },
  eraChipText: {
    fontSize: 15,
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  eraChipArrow: {
    fontSize: 18,
    color: 'var(--text-muted)',
  },
  eraGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  eraOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    padding: '8px 4px',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '2px solid #D1D5DB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color 0.2s',
  },
  radioCircleActive: {
    borderColor: '#764BA2',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#764BA2',
  },
  eraLabel: {
    fontSize: 14,
  },
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    padding: '7px 14px',
    borderRadius: 20,
    border: '1.5px solid #E8E4F0',
    background: 'white',
    fontSize: 13,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  tagChipActive: {
    background: 'rgba(118,75,162,0.08)',
    borderColor: '#764BA2',
    color: '#764BA2',
    fontWeight: 600,
  },
  bottomAction: {
    padding: '12px 16px',
    paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
    borderTop: '1px solid var(--border)',
    background: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
};
