import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import PostScreen from './screens/PostScreen.jsx';
import DetailScreen from './screens/DetailScreen.jsx';
import SearchScreen from './screens/SearchScreen.jsx';
import NotificationScreen from './screens/NotificationScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import TodayScreen from './screens/TodayScreen.jsx';
import TimeCapsuleScreen from './screens/TimeCapsuleScreen.jsx';
import ShareScreen from './screens/ShareScreen.jsx';

const HIDE_NAV = ['/post', '/share'];

export default function App() {
  const location = useLocation();
  const showNav = !HIDE_NAV.some(p => location.pathname.startsWith(p));

  return (
    <>
      <Routes>
        <Route path="/"              element={<HomeScreen />} />
        <Route path="/post"          element={<PostScreen />} />
        <Route path="/detail/:id"    element={<DetailScreen />} />
        <Route path="/search"        element={<SearchScreen />} />
        <Route path="/notifications" element={<NotificationScreen />} />
        <Route path="/profile"       element={<ProfileScreen />} />
        <Route path="/today"         element={<TodayScreen />} />
        <Route path="/timecapsule"   element={<TimeCapsuleScreen />} />
        <Route path="/share/:id"     element={<ShareScreen />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}
