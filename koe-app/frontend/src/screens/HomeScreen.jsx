import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PostCard from '../components/PostCard.jsx';
import { BellIcon } from '../components/Header.jsx';
import { api } from '../api/client.js';

const TABS = [
  { key: 'now',    label: 'いま',  subtitle: '同世代の声' },
  { key: 'past',   label: '過去',  subtitle: '上の世代から' },
  { key: 'future', label: '未来',  subtitle: '下の世代へ' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('now');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (type) => {
    setLoading(true);
    try {
      const data = await api.getPosts({ type });
      setPosts(data);
    } catch (_) {
      setPosts(FALLBACK_POSTS.filter(p => type === 'now' ? true : p.type === type));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(activeTab); }, [activeTab, fetchPosts]);

  return (
    <div style={styles.container}>
      <Header
        title="KOE"
        right={
          <button className="icon-btn" onClick={() => navigate('/notifications')}>
            <BellIcon hasDot />
          </button>
        }
      />

      {/* Tab bar */}
      <div style={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab.key)}
          >
            <span style={{ ...styles.tabLabel, ...(activeTab === tab.key ? styles.tabLabelActive : {}) }}>
              {tab.label}
            </span>
            {activeTab === tab.key && <div style={styles.tabUnderline} />}
          </button>
        ))}
      </div>

      <div className="screen">
        {/* Today's highlight banner */}
        <div style={styles.todayBanner} onClick={() => navigate('/today')}>
          <div style={styles.todayLeft}>
            <span style={styles.todayDot} />
            <span style={styles.todayText}>今日の1通</span>
          </div>
          <span style={styles.todayArrow}>›</span>
        </div>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} onResonate={() => fetchPosts(activeTab)} />
          ))
        )}

        {!loading && posts.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyText}>まだ投稿がありません</p>
            <p style={styles.emptySubtext}>最初の声を残してみましょう</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 16, margin: '8px 12px', boxShadow: '0 2px 8px rgba(102,126,234,0.08)' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: '40%', height: 14, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '60%', height: 11 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '60%' }} />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
    background: 'white',
    flexShrink: 0,
  },
  tab: {
    flex: 1,
    padding: '12px 0 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    position: 'relative',
    paddingBottom: 0,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text-muted)',
    paddingBottom: 10,
  },
  tabLabelActive: {
    color: 'var(--grad-mid)',
    fontWeight: 700,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2.5,
    borderRadius: 2,
    background: 'linear-gradient(90deg, #667EEA, #F093FB)',
  },
  todayBanner: {
    margin: '10px 12px 4px',
    background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(240,147,251,0.1) 100%)',
    border: '1px solid rgba(118,75,162,0.15)',
    borderRadius: 12,
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  todayLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667EEA, #F093FB)',
    boxShadow: '0 0 6px rgba(240,147,251,0.6)',
  },
  todayText: {
    fontSize: 13,
    fontWeight: 600,
    background: 'linear-gradient(135deg, #667EEA, #764BA2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  todayArrow: {
    fontSize: 20,
    color: '#764BA2',
    lineHeight: 1,
  },
  empty: {
    textAlign: 'center',
    padding: '60px 24px',
  },
  emptyText: {
    fontSize: 16,
    color: 'var(--text-secondary)',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: 'var(--text-muted)',
  },
};

const FALLBACK_POSTS = [
  {
    id: '1', userId: '1', name: 'みお', username: 'mio_98',
    era: '1998年生まれ', ageLabel: '26歳', birthYear: 1998,
    text: 'ふと、思ったこと。\n将来のことを考えると、\n不安になるけど、\nそれ以上にワクワクしてる。',
    tags: ['#将来のこと', '#モヤモヤ'],
    resonances: 128, comments: 23, shares: 12, type: 'now',
  },
  {
    id: '2', userId: '2', name: 'jun', username: 'jun_70s',
    era: '1970年代生まれ', ageLabel: '50代', birthYear: 1973,
    text: '若い頃の自分へ。\n焦らなくていいよ。\n道は、ちゃんと\nあとからつながってる。',
    tags: ['#若い頃へ', '#人生'],
    resonances: 96, comments: 12, shares: 8, type: 'past',
  },
  {
    id: '3', userId: '3', name: 'はる', username: 'haru_05',
    era: '2005年生まれ', ageLabel: '19歳', birthYear: 2005,
    text: 'みんなと同じように\nできない自分が嫌になる日もある。\nでも、その日もきっと意味がある。',
    tags: [],
    resonances: 45, comments: 7, shares: 3, type: 'future',
  },
];
