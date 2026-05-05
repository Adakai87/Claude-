import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function PostCard({ post, onResonate, style }) {
  const navigate = useNavigate();
  const [resonated, setResonated] = useState(false);
  const [count, setCount] = useState(post.resonances);

  const handleResonate = async (e) => {
    e.stopPropagation();
    if (resonated) return;
    try {
      await api.resonatePost(post.id);
      setCount(c => c + 1);
      setResonated(true);
      onResonate?.();
    } catch (_) {}
  };

  const initials = (post.name || post.username || '?')[0];

  return (
    <article
      className="fade-in"
      style={{ ...styles.card, ...style }}
      onClick={() => navigate(`/detail/${post.id}`)}
    >
      <div style={styles.header}>
        <div style={styles.userRow}>
          <div className="avatar" style={{ background: avatarGrad(post.birthYear) }}>
            {initials}
          </div>
          <div style={styles.userInfo}>
            <span style={styles.name}>{post.name}</span>
            <span style={styles.era}>
              <span className="era-badge">{post.era}・{post.ageLabel}</span>
            </span>
          </div>
        </div>
        <button className="icon-btn" onClick={e => e.stopPropagation()}>
          <DotsIcon />
        </button>
      </div>

      <p style={styles.text}>{post.text}</p>

      {post.tags?.length > 0 && (
        <div style={styles.tags}>
          {post.tags.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        <button
          style={{ ...styles.action, color: resonated ? '#F093FB' : 'var(--text-muted)' }}
          onClick={handleResonate}
        >
          <HeartIcon filled={resonated} />
          <span>{count}</span>
        </button>
        <button style={styles.action} onClick={e => { e.stopPropagation(); navigate(`/detail/${post.id}`); }}>
          <CommentIcon />
          <span>{post.comments}</span>
        </button>
        <button style={styles.action} onClick={e => { e.stopPropagation(); navigate(`/share/${post.id}`); }}>
          <ShareIcon />
          <span>{post.shares}</span>
        </button>
        <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={e => e.stopPropagation()}>
          <BookmarkIcon />
        </button>
      </div>
    </article>
  );
}

function avatarGrad(birthYear) {
  if (!birthYear) return 'linear-gradient(135deg, #667EEA, #764BA2)';
  const h = ((birthYear * 37) % 360);
  return `linear-gradient(135deg, hsl(${h},60%,55%), hsl(${(h+40)%360},65%,50%))`;
}

const styles = {
  card: {
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    margin: '8px 12px',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    border: '1px solid rgba(232,228,240,0.6)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  era: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  text: {
    fontSize: 15,
    lineHeight: 1.7,
    color: 'var(--text-primary)',
    whiteSpace: 'pre-line',
    margin: '0 0 10px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontSize: 13,
    padding: '2px 0',
    transition: 'color 0.2s',
  },
};

export function HeartIcon({ filled, color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#F093FB' : 'none'}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke={filled ? '#F093FB' : (color || '#9CA3AF')} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke="#9CA3AF" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
        stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="5"  cy="12" r="1.5" fill="#9CA3AF" />
      <circle cx="12" cy="12" r="1.5" fill="#9CA3AF" />
      <circle cx="19" cy="12" r="1.5" fill="#9CA3AF" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
        stroke="#9CA3AF" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
