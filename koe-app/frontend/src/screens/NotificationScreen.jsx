import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { api } from '../api/client.js';

const TABS = [
  { key: 'all',      label: 'すべて' },
  { key: 'resonance',label: 'いいね' },
  { key: 'timeleap', label: '返信' },
  { key: 'follow',   label: 'フォロー' },
];

const ICON_MAP = {
  resonance: { icon: HeartNotifIcon, color: '#F093FB', bg: 'rgba(240,147,251,0.12)' },
  timeleap:  { icon: TimeleapIcon,   color: '#667EEA', bg: 'rgba(102,126,234,0.12)' },
  today:     { icon: TodayIcon,      color: '#764BA2', bg: 'rgba(118,75,162,0.12)' },
  follow:    { icon: FollowIcon,     color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  milestone: { icon: MilestoneIcon,  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
};

const FALLBACK = [
  { id: 'n1', type: 'resonance', message: '@haru_05 さんがあなたの投稿に「共鳴」しました。', read: false, createdAt: '2024-05-18T11:05:00Z' },
  { id: 'n2', type: 'timeleap',  message: 'あなたの声に、1970年代生まれの方が返信しました。', read: false, createdAt: '2024-05-18T11:00:00Z' },
  { id: 'n3', type: 'today',     message: '今日の1通が更新されました。', read: true,  createdAt: '2024-05-18T08:00:00Z' },
  { id: 'n4', type: 'follow',    message: '@mio_98 さんがあなたをフォローしました。', read: true,  createdAt: '2024-05-18T07:30:00Z' },
  { id: 'n5', type: 'milestone', message: 'あなたの投稿が100回共鳴されました！おめでとうございます🎉', read: true,  createdAt: '2024-05-18T05:00:00Z' },
];

export default function NotificationScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.getNotifications()
      .then(setNotifications)
      .catch(() => setNotifications(FALLBACK));
  }, []);

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeTab);

  const markRead = async (id) => {
    try { await api.markNotificationRead(id); } catch (_) {}
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div style={styles.container}>
      <Header title="通知" />

      {/* Tabs */}
      <div style={styles.tabRow}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="screen">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
            通知はありません
          </div>
        ) : (
          filtered.map(n => <NotifItem key={n.id} notif={n} onRead={markRead} navigate={navigate} />)
        )}
      </div>
    </div>
  );
}

function NotifItem({ notif, onRead, navigate }) {
  const cfg = ICON_MAP[notif.type] || ICON_MAP.today;
  const Icon = cfg.icon;

  return (
    <div
      style={{ ...styles.item, background: notif.read ? 'white' : 'rgba(102,126,234,0.04)' }}
      onClick={() => { onRead(notif.id); if (notif.type === 'today') navigate('/today'); }}
    >
      <div style={{ ...styles.iconWrap, background: cfg.bg }}>
        <Icon color={cfg.color} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={styles.message}>{notif.message}</p>
        <p style={styles.time}>{relativeTime(notif.createdAt)}</p>
      </div>
      {!notif.read && <div style={styles.unreadDot} />}
    </div>
  );
}

function relativeTime(str) {
  const diff = Date.now() - new Date(str).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  return `${Math.floor(h / 24)}日前`;
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  tabRow: {
    display: 'flex', borderBottom: '1px solid var(--border)',
    background: 'white', flexShrink: 0,
  },
  tab: {
    flex: 1, padding: '12px 0', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit',
    fontWeight: 500, borderBottom: '2.5px solid transparent', transition: 'all 0.15s',
  },
  tabActive: {
    color: '#764BA2', fontWeight: 700,
    borderBottom: '2.5px solid #764BA2',
  },
  item: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px 16px', borderBottom: '1px solid var(--border)',
    cursor: 'pointer', transition: 'background 0.15s',
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  message: { fontSize: 14, lineHeight: 1.55, color: 'var(--text-primary)', marginBottom: 4 },
  time: { fontSize: 12, color: 'var(--text-muted)' },
  unreadDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'linear-gradient(135deg, #667EEA, #F093FB)',
    marginTop: 4, flexShrink: 0,
  },
};

function HeartNotifIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill={color}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
}
function TimeleapIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke={color} strokeWidth="2" strokeLinecap="round" /></svg>;
}
function TodayIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.8" /><path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function FollowIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.8" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 10l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function MilestoneIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}
