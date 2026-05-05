import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PostCard from '../components/PostCard.jsx';
import { api, currentUser } from '../api/client.js';

const PROFILE_TABS = [
  { key: 'posts',  label: '投稿' },
  { key: 'replied',label: '返信した声' },
  { key: 'liked',  label: 'いいねした声' },
];

const BADGES = [
  { icon: '🚀', label: '未来に届いた', color: '#667EEA' },
  { icon: '💫', label: '世代を越えた共感', color: '#764BA2' },
  { icon: '🌟', label: '100回共鳴', color: '#F59E0B' },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.getUser(currentUser.id)
      .then(data => {
        setUser(data);
        setPosts(data.posts || []);
      })
      .catch(() => {
        setUser(FALLBACK_USER);
        setPosts(FALLBACK_POSTS);
      });
  }, []);

  if (!user) return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)' }}>読み込み中...</p></div>;

  return (
    <div style={styles.container}>
      <Header
        title="プロフィール"
        right={
          <button className="icon-btn" onClick={() => navigate('/timecapsule')}>
            <TimeCapsuleIcon />
          </button>
        }
      />

      <div className="screen">
        {/* Cover / Avatar area */}
        <div style={styles.cover}>
          <div style={styles.coverGrad} />
          <div style={styles.avatarWrap}>
            <div className="avatar lg">
              {(user.name || '?')[0]}
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={styles.infoSection}>
          <div style={styles.nameRow}>
            <div>
              <h2 style={styles.name}>{user.name}</h2>
              <p style={styles.username}>@{user.username}</p>
            </div>
            <button style={styles.editBtn}>プロフィールを編集</button>
          </div>

          <p style={styles.era}>{user.era}・{user.ageLabel}</p>
          <p style={styles.bio}>{user.bio}</p>

          {/* Stats */}
          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <span style={styles.statNum}>{user.postCount}</span>
              <span style={styles.statLabel}>投稿</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>{user.resonanceCount}</span>
              <span style={styles.statLabel}>共鳴した数</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNum}>{user.timeleapCount}</span>
              <span style={styles.statLabel}>時を越えた返信</span>
            </div>
          </div>

          {/* Badges */}
          <div style={styles.badgesRow}>
            {BADGES.map(b => (
              <div key={b.label} style={{ ...styles.badge, borderColor: b.color + '33', background: b.color + '11' }}>
                <span style={{ fontSize: 16 }}>{b.icon}</span>
                <span style={{ ...styles.badgeLabel, color: b.color }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Post tabs */}
        <div style={styles.tabRow}>
          {PROFILE_TABS.map(tab => (
            <button
              key={tab.key}
              style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {activeTab === 'posts' && posts.map(p => (
          <PostCard key={p.id} post={p} />
        ))}
        {activeTab !== 'posts' && (
          <p style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)', fontSize: 14 }}>
            {activeTab === 'replied' ? '返信した声はまだありません' : 'いいねした声はまだありません'}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  cover: {
    height: 120, position: 'relative', flexShrink: 0,
  },
  coverGrad: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 60%, #F093FB 100%)',
  },
  avatarWrap: {
    position: 'absolute', bottom: -36, left: 16,
  },
  infoSection: { padding: '44px 16px 0' },
  nameRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  name: { fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' },
  username: { fontSize: 13, color: 'var(--text-muted)', marginTop: 2 },
  editBtn: {
    padding: '7px 16px', borderRadius: 20, background: 'none',
    border: '1.5px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)',
    cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
  },
  era: { fontSize: 13, color: 'var(--grad-mid)', fontWeight: 600, marginBottom: 8 },
  bio: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16, whiteSpace: 'pre-line' },
  statsRow: { display: 'flex', gap: 0, marginBottom: 16 },
  stat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  statNum: { fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' },
  statLabel: { fontSize: 11, color: 'var(--text-muted)' },
  statDivider: { width: 1, background: 'var(--border)', margin: '0 4px' },
  badgesRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8, paddingBottom: 16, borderBottom: '1px solid var(--border)' },
  badge: {
    display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
    borderRadius: 20, border: '1px solid',
  },
  badgeLabel: { fontSize: 11, fontWeight: 600 },
  tabRow: {
    display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0,
    background: 'white', position: 'sticky', top: 0, zIndex: 10,
  },
  tab: {
    flex: 1, padding: '12px 0', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)',
    fontFamily: 'inherit', fontWeight: 500, borderBottom: '2.5px solid transparent',
  },
  tabActive: { color: '#764BA2', fontWeight: 700, borderBottom: '2.5px solid #764BA2' },
};

function TimeCapsuleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#764BA2" strokeWidth="1.8" />
      <path d="M12 7v5l3 3" stroke="#764BA2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const FALLBACK_USER = {
  id: '1', name: 'みお', username: 'mio_98',
  era: '1998年生まれ', ageLabel: '26歳',
  bio: '未来の自分に、ちょっと期待してる。\n今を、ちゃんと生きたい。',
  postCount: 128, resonanceCount: 342, timeleapCount: 78,
};
const FALLBACK_POSTS = [
  {
    id: '1', name: 'みお', username: 'mio_98', era: '1998年生まれ', ageLabel: '26歳', birthYear: 1998,
    text: 'ふと、思ったこと。\n将来のことを考えると、\n不安になるけど、\nそれ以上にワクワクしてる。',
    tags: ['#将来のこと', '#モヤモヤ'], resonances: 128, comments: 23, shares: 12,
  },
];
