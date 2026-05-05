const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// ── Mock Data ──────────────────────────────────────────────
const users = [
  {
    id: '1', name: 'みお', username: 'mio_98',
    era: '1998年生まれ', ageLabel: '26歳',
    bio: '未来の自分に、ちょっと期待してる。\n今を、ちゃんと生きたい。',
    avatar: null, birthYear: 1998,
    postCount: 128, resonanceCount: 342, timeleapCount: 78,
  },
  {
    id: '2', name: 'jun', username: 'jun_70s',
    era: '1970年代生まれ', ageLabel: '50代',
    bio: '人生の先輩として、若い世代に伝えたいことがある。',
    avatar: null, birthYear: 1973,
    postCount: 45, resonanceCount: 210, timeleapCount: 34,
  },
  {
    id: '3', name: 'はる', username: 'haru_05',
    era: '2005年生まれ', ageLabel: '19歳',
    bio: 'ありがとうございます。今、すごく救われました。',
    avatar: null, birthYear: 2005,
    postCount: 23, resonanceCount: 89, timeleapCount: 12,
  },
];

let posts = [
  {
    id: '1', userId: '1',
    text: 'ふと、思ったこと。\n将来のことを考えると、\n不安になるけど、\nそれ以上にワクワクしてる。',
    era: '1998年生まれ', ageLabel: '26歳', birthYear: 1998,
    targetEra: 'all', tags: ['#将来のこと', '#モヤモヤ'],
    resonances: 128, comments: 23, shares: 12,
    createdAt: '2024-05-18T10:00:00Z', type: 'now',
    username: 'mio_98', name: 'みお',
  },
  {
    id: '2', userId: '2',
    text: '若い頃の自分へ。\n焦らなくていいよ。\n道は、ちゃんと\nあとからつながってる。',
    era: '1970年代生まれ', ageLabel: '50代', birthYear: 1973,
    targetEra: 'youth', tags: ['#若い頃へ', '#人生'],
    resonances: 96, comments: 12, shares: 8,
    createdAt: '2024-05-18T09:00:00Z', type: 'past',
    username: 'jun_70s', name: 'jun',
  },
  {
    id: '3', userId: '3',
    text: 'みんなと同じように\nできない自分が嫌になる日もある。\nでも、その日もきっと意味がある。',
    era: '2005年生まれ', ageLabel: '19歳', birthYear: 2005,
    targetEra: 'all', tags: [],
    resonances: 45, comments: 7, shares: 3,
    createdAt: '2024-05-17T20:00:00Z', type: 'future',
    username: 'haru_05', name: 'はる',
  },
  {
    id: '4', userId: '2',
    text: '30代の頃、夢を諦めかけた。\nでも続けてよかった。\nあなたも、まだ諦めないで。',
    era: '1970年代生まれ', ageLabel: '50代', birthYear: 1973,
    targetEra: 'youth', tags: ['#夢', '#諦めないで', '#人生'],
    resonances: 203, comments: 31, shares: 19,
    createdAt: '2024-05-16T15:00:00Z', type: 'past',
    username: 'jun_70s', name: 'jun',
  },
  {
    id: '5', userId: '1',
    text: '10年後の自分へ。\nあの時の決断は正しかったですか？\n今は怖くて仕方ないけど、進んでいます。',
    era: '1998年生まれ', ageLabel: '26歳', birthYear: 1998,
    targetEra: 'future', tags: ['#10年後へ', '#決断', '#将来のこと'],
    resonances: 76, comments: 18, shares: 5,
    createdAt: '2024-05-15T12:00:00Z', type: 'now',
    username: 'mio_98', name: 'みお',
  },
  {
    id: '6', userId: '3',
    text: '就活がこんなに辛いとは思わなかった。\n先輩たち、どうやって乗り越えたんですか？',
    era: '2005年生まれ', ageLabel: '19歳', birthYear: 2005,
    targetEra: 'past', tags: ['#就活', '#モヤモヤ', '#相談'],
    resonances: 112, comments: 42, shares: 7,
    createdAt: '2024-05-14T18:00:00Z', type: 'future',
    username: 'haru_05', name: 'はる',
  },
];

let comments = [
  {
    id: 'c1', postId: '1', userId: '3',
    text: 'ありがとうございます。今、すごく救われました。',
    era: '2005年生まれ', ageLabel: '19歳', username: 'haru_05', name: 'はる',
    resonances: 32, createdAt: '2024-05-18T11:00:00Z',
  },
  {
    id: 'c2', postId: '1', userId: '1',
    text: '泣きそうになった。\nいつか、私も誰かに届けたい。',
    era: '1998年生まれ', ageLabel: '26歳', username: 'mio_98', name: 'みお',
    resonances: 18, createdAt: '2024-05-18T12:00:00Z',
  },
  {
    id: 'c3', postId: '2', userId: '3',
    text: '「道はあとからつながる」って言葉、刺さりました。',
    era: '2005年生まれ', ageLabel: '19歳', username: 'haru_05', name: 'はる',
    resonances: 24, createdAt: '2024-05-18T10:30:00Z',
  },
];

let notifications = [
  {
    id: 'n1', type: 'resonance', userId: '3', targetUserId: '1',
    postId: '1', message: '@haru_05 さんがあなたの投稿に「共鳴」しました。',
    read: false, createdAt: '2024-05-18T11:05:00Z',
  },
  {
    id: 'n2', type: 'timeleap', userId: '2', targetUserId: '1',
    postId: '1', message: 'あなたの声に、1970年代生まれの方が返信しました。',
    read: false, createdAt: '2024-05-18T11:00:00Z',
  },
  {
    id: 'n3', type: 'today', userId: null, targetUserId: '1',
    postId: null, message: '今日の1通が更新されました。',
    read: true, createdAt: '2024-05-18T08:00:00Z',
  },
  {
    id: 'n4', type: 'follow', userId: '2', targetUserId: '1',
    postId: null, message: '@mio_98 さんがあなたをフォローしました。',
    read: true, createdAt: '2024-05-18T07:30:00Z',
  },
  {
    id: 'n5', type: 'milestone', userId: null, targetUserId: '1',
    postId: '5', message: 'あなたの投稿が100回共鳴されました！おめでとうございます🎉',
    read: true, createdAt: '2024-05-18T05:00:00Z',
  },
];

let timecapsules = [
  {
    id: 'tc1', userId: '1',
    text: '3年後の自分へ。\nその時のあなたに、\n伝えたいことを。',
    deliverAt: '2027-05-18', targetEra: 'future', status: 'pending',
    createdAt: '2024-05-18T10:00:00Z',
  },
];

const todayPost = {
  id: 'today1',
  fromEra: '1970年代生まれ', fromAgeLabel: '50代', toEra: '20代',
  text: '「大丈夫。\nなんとかなるよ、\nきっと。」',
  username: 'jun_70s',
  pastMessages: [
    { id: 'p1', text: '若さは最強の武器。', fromEra: '60代', date: '5/17' },
    { id: 'p2', text: '失敗を恐れるな。', fromEra: '40代', date: '5/16' },
    { id: 'p3', text: '今この瞬間を大事に。', fromEra: '50代', date: '5/15' },
  ],
};

// ── Routes ──────────────────────────────────────────────────

// GET /posts
app.get('/posts', (req, res) => {
  const { type, tag, q, sort = 'new' } = req.query;
  let result = [...posts];
  if (type && type !== 'all') result = result.filter(p => p.type === type);
  if (tag) result = result.filter(p => p.tags.includes(tag));
  if (q) result = result.filter(p => p.text.includes(q) || p.tags.some(t => t.includes(q)));
  if (sort === 'popular') result.sort((a, b) => b.resonances - a.resonances);
  else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(result);
});

// GET /posts/:id
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

// POST /posts
app.post('/posts', (req, res) => {
  const { text, era, ageLabel, birthYear, targetEra, tags, userId, username, name } = req.body;
  const newPost = {
    id: uuidv4(), userId: userId || '1',
    text, era, ageLabel, birthYear: birthYear || 1998,
    targetEra: targetEra || 'all',
    tags: tags || [], resonances: 0, comments: 0, shares: 0,
    createdAt: new Date().toISOString(), type: 'now',
    username: username || 'mio_98', name: name || 'みお',
  };
  posts.unshift(newPost);
  res.status(201).json(newPost);
});

// POST /posts/:id/resonate
app.post('/posts/:id/resonate', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  post.resonances += 1;
  res.json(post);
});

// GET /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
  const postComments = comments.filter(c => c.postId === req.params.id);
  res.json(postComments);
});

// POST /comments
app.post('/comments', (req, res) => {
  const { postId, text, era, ageLabel, userId, username, name } = req.body;
  const newComment = {
    id: uuidv4(), postId, userId: userId || '1',
    text, era, ageLabel, username: username || 'mio_98', name: name || 'みお',
    resonances: 0, createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  const post = posts.find(p => p.id === postId);
  if (post) post.comments += 1;
  res.status(201).json(newComment);
});

// GET /users/:id
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const userPosts = posts.filter(p => p.userId === req.params.id);
  res.json({ ...user, posts: userPosts });
});

// GET /notifications
app.get('/notifications', (req, res) => {
  res.json(notifications);
});

// POST /notifications/:id/read
app.post('/notifications/:id/read', (req, res) => {
  const n = notifications.find(n => n.id === req.params.id);
  if (n) n.read = true;
  res.json({ ok: true });
});

// GET /today
app.get('/today', (req, res) => {
  res.json(todayPost);
});

// GET /timecapsules
app.get('/timecapsules', (req, res) => {
  res.json(timecapsules.filter(tc => tc.userId === '1'));
});

// POST /timecapsules
app.post('/timecapsules', (req, res) => {
  const { text, deliverAt, targetEra } = req.body;
  const tc = {
    id: uuidv4(), userId: '1', text,
    deliverAt, targetEra: targetEra || 'future',
    status: 'pending', createdAt: new Date().toISOString(),
  };
  timecapsules.push(tc);
  res.status(201).json(tc);
});

// GET /tags/popular
app.get('/tags/popular', (req, res) => {
  const tags = [
    { tag: '#将来のこと', count: 12345 },
    { tag: '#恋愛', count: 8765 },
    { tag: '#仕事', count: 9301 },
    { tag: '#人生', count: 15679 },
    { tag: '#夢', count: 6543 },
    { tag: '#家族', count: 7890 },
    { tag: '#モヤモヤ', count: 5432 },
    { tag: '#感謝', count: 9001 },
  ];
  res.json(tags);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`KOE backend running on port ${PORT}`));
