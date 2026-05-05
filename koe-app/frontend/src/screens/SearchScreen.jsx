import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PostCard from '../components/PostCard.jsx';
import { api } from '../api/client.js';

const ERA_FILTERS = [
  { key: 'all',    label: 'すべて' },
  { key: 'now',    label: 'いま' },
  { key: 'past',   label: '過去' },
  { key: 'future', label: '未来' },
];

const POPULAR_THEMES = [
  { tag: '#将来のこと', count: '12,345' },
  { tag: '#恋愛',       count: '8,765' },
  { tag: '#仕事',       count: '9,301' },
  { tag: '#人生',       count: '15,679' },
  { tag: '#夢',         count: '6,543' },
  { tag: '#家族',       count: '7,890' },
  { tag: '#モヤモヤ',   count: '5,432' },
  { tag: '#感謝',       count: '9,001' },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [eraFilter, setEraFilter] = useState('all');
  const [sort, setSort] = useState('popular');
  const [yearRange, setYearRange] = useState(1990);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q, era) => {
    if (!q && era === 'all') return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.getPosts({ q: q || undefined, type: era !== 'all' ? era : undefined, sort });
      setPosts(data);
    } catch (_) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    handleSearch(tag, eraFilter);
  };

  return (
    <div style={styles.container}>
      <Header title="検索" />

      <div className="screen">
        {/* Search bar */}
        <div style={styles.searchBar}>
          <SearchIcon />
          <input
            style={styles.searchInput}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="キーワードで検索"
            onKeyDown={e => e.key === 'Enter' && handleSearch(query, eraFilter)}
          />
          {query && (
            <button style={styles.clearBtn} onClick={() => { setQuery(''); setSearched(false); }}>✕</button>
          )}
        </div>

        {/* Era filter tabs */}
        <div style={styles.eraTabRow}>
          {ERA_FILTERS.map(f => (
            <button
              key={f.key}
              style={{ ...styles.eraTab, ...(eraFilter === f.key ? styles.eraTabActive : {}) }}
              onClick={() => { setEraFilter(f.key); if (searched) handleSearch(query, f.key); }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Year slider */}
        <div style={styles.sliderSection}>
          <div style={styles.sliderHeader}>
            <span style={styles.sliderLabel}>年代スライダー</span>
            <span style={styles.sliderValue}>{yearRange}年代</span>
          </div>
          <input
            type="range" min={1960} max={2060} value={yearRange}
            onChange={e => setYearRange(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderTicks}>
            {['1960', '1980', '2000', '2020', '2040', '2060'].map(y => (
              <span key={y} style={styles.sliderTick}>{y}</span>
            ))}
          </div>
        </div>

        {!searched ? (
          <>
            {/* Popular themes */}
            <div style={styles.section}>
              <p style={styles.sectionTitle}>人気のテーマ</p>
              <div style={styles.themeGrid}>
                {POPULAR_THEMES.map(({ tag, count }) => (
                  <button key={tag} style={styles.themeItem} onClick={() => handleTagClick(tag)}>
                    <span style={styles.themeTag}>{tag}</span>
                    <span style={styles.themeCount}>{count}の声</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ paddingTop: 8 }}>
            {/* Sort toggle */}
            <div style={styles.sortRow}>
              <button
                style={{ ...styles.sortBtn, ...(sort === 'popular' ? styles.sortBtnActive : {}) }}
                onClick={() => { setSort('popular'); handleSearch(query, eraFilter); }}
              >人気</button>
              <button
                style={{ ...styles.sortBtn, ...(sort === 'new' ? styles.sortBtnActive : {}) }}
                onClick={() => { setSort('new'); handleSearch(query, eraFilter); }}
              >新着</button>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>検索中...</p>
            ) : posts.length > 0 ? (
              posts.map(p => <PostCard key={p.id} post={p} />)
            ) : (
              <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>結果が見つかりませんでした</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  searchBar: {
    display: 'flex', alignItems: 'center', gap: 10,
    margin: '12px', padding: '10px 14px',
    background: '#F8F7FF', borderRadius: 12, border: '1.5px solid var(--border)',
  },
  searchInput: {
    flex: 1, border: 'none', outline: 'none', background: 'transparent',
    fontSize: 15, fontFamily: 'inherit', color: 'var(--text-primary)',
  },
  clearBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 },
  eraTabRow: {
    display: 'flex', gap: 8, padding: '0 12px 12px', overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  eraTab: {
    padding: '7px 16px', borderRadius: 20, border: '1.5px solid var(--border)',
    background: 'white', fontSize: 13, color: 'var(--text-secondary)',
    cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', fontWeight: 500,
    transition: 'all 0.15s',
  },
  eraTabActive: {
    background: 'rgba(118,75,162,0.1)', borderColor: '#764BA2', color: '#764BA2', fontWeight: 700,
  },
  sliderSection: { padding: '0 16px 16px' },
  sliderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  sliderLabel: { fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 },
  sliderValue: { fontSize: 13, fontWeight: 700, color: '#764BA2' },
  slider: {
    width: '100%', appearance: 'none', height: 4, borderRadius: 2,
    background: 'linear-gradient(90deg, #667EEA, #764BA2)',
    outline: 'none', cursor: 'pointer',
  },
  sliderTicks: { display: 'flex', justifyContent: 'space-between', marginTop: 6 },
  sliderTick: { fontSize: 10, color: 'var(--text-muted)' },
  section: { padding: '0 16px 16px' },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14 },
  themeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  themeItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    padding: '12px 14px', background: '#F8F7FF', borderRadius: 12,
    border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left',
    fontFamily: 'inherit', transition: 'background 0.15s',
  },
  themeTag: { fontSize: 14, fontWeight: 600, color: '#764BA2', marginBottom: 3 },
  themeCount: { fontSize: 11, color: 'var(--text-muted)' },
  sortRow: { display: 'flex', gap: 8, padding: '0 12px 8px' },
  sortBtn: {
    padding: '6px 18px', borderRadius: 20, border: '1.5px solid var(--border)',
    background: 'white', fontSize: 13, color: 'var(--text-secondary)',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  sortBtnActive: {
    background: 'linear-gradient(135deg, #667EEA, #764BA2)', borderColor: 'transparent',
    color: 'white', fontWeight: 600,
  },
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="1.8" />
      <path d="M16.5 16.5L21 21" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
