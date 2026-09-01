import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { MoreIcon } from '../components/Header.jsx';
import { HeartIcon } from '../components/PostCard.jsx';
import { api, currentUser } from '../api/client.js';

export default function DetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState('');
  const [resonated, setResonated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getPost(id), api.getComments(id)])
      .then(([p, c]) => { setPost(p); setComments(c); })
      .catch(() => { setPost(FALLBACK_POST); setComments(FALLBACK_COMMENTS); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleResonate = async () => {
    if (resonated || !post) return;
    try {
      await api.resonatePost(post.id);
      setPost(p => ({ ...p, resonances: p.resonances + 1 }));
      setResonated(true);
    } catch (_) {}
  };

  const handleReply = async () => {
    if (!reply.trim() || !post) return;
    try {
      const newComment = await api.createComment({
        postId: post.id, text: reply.trim(),
        era: currentUser.era, ageLabel: currentUser.ageLabel,
        userId: currentUser.id, username: currentUser.username, name: currentUser.name,
      });
      setComments(c => [...c, newComment]);
      setReply('');
    } catch (_) {}
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Spinner /></div>;
  if (!post) return null;

  const initials = (post.name || '?')[0];

  return (
    <div style={styles.container}>
      <Header
        title=""
        left="back"
        right={
          <button className="icon-btn"><MoreIcon /></button>
        }
      />

      <div className="screen" style={{ paddingBottom: 80 }}>
        {/* Post detail */}
        <div style={styles.postSection}>
          <div style={styles.userRow}>
            <div className="avatar" style={{ background: avatarGrad(post.birthYear), width: 44, height: 44, fontSize: 18 }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <p style={styles.name}>{post.name}</p>
              <p style={styles.eraText}>{post.era}・{post.ageLabel}</p>
            </div>
            <button style={styles.followBtn}>フォロー</button>
          </div>

          <p style={styles.postText}>{post.text}</p>

          {post.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}

          <p style={styles.timestamp}>{formatDate(post.createdAt)}</p>

          {/* Stats */}
          <div style={styles.statsRow}>
            <span style={styles.stat}><b>{post.resonances}</b> 共鳴</span>
            <span style={styles.stat}><b>{post.comments}</b> 返信</span>
            <span style={styles.stat}><b>{post.shares}</b> シェア</span>
          </div>

          {/* Actions */}
          <div style={styles.actionRow}>
            <button
              style={{ ...styles.actionBtn, color: resonated ? '#F093FB' : 'var(--text-muted)' }}
              onClick={handleResonate}
            >
              <HeartIcon filled={resonated} />
              <span>共鳴</span>
            </button>
            <button style={styles.actionBtn}>
              <CommentIconFull />
              <span>返信</span>
            </button>
            <button style={styles.actionBtn} onClick={() => navigate(`/share/${post.id}`)}>
              <ShareIconFull />
              <span>シェア</span>
            </button>
          </div>
        </div>

        <div style={styles.sectionDivider} />

        {/* Comments section */}
        <div style={styles.commentsSection}>
          <p style={styles.commentsTitle}>時を越えて返信</p>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} postEra={post.era} postAge={post.ageLabel} />
          ))}
          {comments.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: 24 }}>
              まだ返信はありません。最初の声を届けよう。
            </p>
          )}
        </div>
      </div>

      {/* Reply input */}
      <div style={styles.replyBar}>
        <div className="avatar sm" style={{ background: avatarGrad(currentUser.birthYear), flexShrink: 0 }}>
          {currentUser.name[0]}
        </div>
        <input
          style={styles.replyInput}
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder="返信を入力..."
          onKeyDown={e => e.key === 'Enter' && handleReply()}
        />
        <button
          style={{ ...styles.sendBtn, opacity: reply.trim() ? 1 : 0.4 }}
          onClick={handleReply}
          disabled={!reply.trim()}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

function CommentItem({ comment, postEra, postAge }) {
  const initials = (comment.name || '?')[0];
  return (
    <div style={styles.commentItem}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div className="avatar sm" style={{ background: avatarGrad(2000), flexShrink: 0, marginTop: 2 }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={styles.commentName}>{comment.name}</span>
            <span style={styles.commentEra}>{comment.era}・{comment.ageLabel}</span>
          </div>
          <p style={styles.commentText}>{comment.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <button style={styles.commentAction}>
              <HeartIcon />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 3 }}>{comment.resonances}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #E8E4F0', borderTopColor: '#764BA2', animation: 'spin 0.8s linear infinite' }} />;
}

function avatarGrad(birthYear) {
  if (!birthYear) return 'linear-gradient(135deg, #667EEA, #764BA2)';
  const h = ((birthYear * 37) % 360);
  return `linear-gradient(135deg, hsl(${h},60%,55%), hsl(${(h+40)%360},65%,50%))`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  postSection: { padding: '16px' },
  userRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  name: { fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 },
  eraText: { fontSize: 12, color: 'var(--text-muted)' },
  followBtn: {
    padding: '6px 16px', borderRadius: 20, background: 'none',
    border: '1.5px solid #764BA2', color: '#764BA2', fontSize: 13,
    fontWeight: 600, cursor: 'pointer',
  },
  postText: { fontSize: 18, lineHeight: 1.8, color: 'var(--text-primary)', whiteSpace: 'pre-line', marginBottom: 14 },
  timestamp: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 },
  statsRow: { display: 'flex', gap: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' },
  stat: { fontSize: 14, color: 'var(--text-secondary)' },
  actionRow: { display: 'flex', justifyContent: 'space-around', paddingTop: 8 },
  actionBtn: {
    display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
    cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, padding: '6px 12px', borderRadius: 8,
  },
  sectionDivider: { height: 8, background: '#F8F7FF' },
  commentsSection: { padding: '16px' },
  commentsTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16 },
  commentItem: { marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' },
  commentName: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' },
  commentEra: { fontSize: 11, color: 'var(--text-muted)' },
  commentText: { fontSize: 14, lineHeight: 1.65, color: 'var(--text-primary)' },
  commentAction: { display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  replyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
    background: 'white', borderTop: '1px solid var(--border)',
  },
  replyInput: {
    flex: 1, border: 'none', outline: 'none', background: '#F8F7FF',
    borderRadius: 20, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit',
    color: 'var(--text-primary)',
  },
  sendBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' },
};

function CommentIconFull() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#9CA3AF" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}
function ShareIconFull() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function SendIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#764BA2" strokeWidth="2" strokeLinejoin="round" /></svg>;
}

const FALLBACK_POST = {
  id: '2', userId: '2', name: 'jun', username: 'jun_70s',
  era: '1970年代生まれ', ageLabel: '50代', birthYear: 1973,
  text: '若い頃の自分へ。\n焦らなくていいよ。\n道は、ちゃんと\nあとからつながってる。',
  tags: ['#若い頃へ', '#人生'],
  resonances: 96, comments: 12, shares: 8, createdAt: '2024-05-18T09:00:00Z',
};
const FALLBACK_COMMENTS = [
  { id: 'c1', postId: '2', name: 'はる', username: 'haru_05', era: '2005年生まれ', ageLabel: '19歳', text: 'ありがとうございます。今、すごく救われました。', resonances: 32, createdAt: '2024-05-18T11:00:00Z' },
  { id: 'c2', postId: '2', name: 'みお', username: 'mio_98', era: '1998年生まれ', ageLabel: '26歳', text: '泣きそうになった。\nいつか、私も誰かに届けたい。', resonances: 18, createdAt: '2024-05-18T12:00:00Z' },
];
