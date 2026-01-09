import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();
const NotificationContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notifAnim, setNotifAnim] = useState(false);
  const prevNotifCount = useRef(0);

  const fetchNotifications = React.useCallback(async () => {
    if (!token) {
      setNotifications([]);
      return;
    }
    try {
      const res = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (e) {
      setNotifications([]);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [token, user, fetchNotifications]);

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > prevNotifCount.current) {
      setNotifAnim(true);
      setTimeout(() => setNotifAnim(false), 1200);
    }
    prevNotifCount.current = unreadCount;
  }, [notifications]);

  const addNotification = async (message, type = null) => {
    if (!token) return;
    try {
      const res = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, type })
      });
      if (res.ok) {
        const notif = await res.json();
        setNotifications(prev => [notif, ...prev]);
        setNotifAnim(true);
        setTimeout(() => setNotifAnim(false), 1200);
      }
    } catch (e) {}
  };

  const deleteNotification = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(API_ENDPOINTS.NOTIFICATION_DELETE(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (e) {}
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const res = await fetch(API_ENDPOINTS.NOTIFICATION_MARK_ALL_READ, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (e) {}
  };

  const markAsRead = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(API_ENDPOINTS.NOTIFICATION_MARK_READ(id), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!token) setNotifications([]);
  }, [token]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, deleteNotification, markAllAsRead, markAsRead, notifAnim, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = React.useCallback((userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const updateUser = React.useCallback((nextUser) => {
    if (!nextUser) return;
    setUser(nextUser);
    try {
      localStorage.setItem('user', JSON.stringify(nextUser));
    } catch (_) {}
  }, []);

  const isAuthenticated = React.useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  const value = React.useMemo(() => ({
    user,
    setUser,
    token,
    login,
    logout,
    updateUser,
    isAuthenticated,
    loading
  }), [user, token, login, logout, updateUser, isAuthenticated, loading]);

  return (
    <AuthContext.Provider value={value}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthContext.Provider>
  );
}; 