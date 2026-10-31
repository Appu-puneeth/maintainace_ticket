import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('FIXIT_USER');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('FIXIT_API_URL') || '');
  const [isLiveApiConnected, setIsLiveApiConnected] = useState(false);

  useEffect(() => {
    // Check if live API is accessible
    const checkConnection = async () => {
      try {
        const res = await fetch(`${api.getBaseUrl()}/health`, { signal: AbortSignal.timeout(1500) });
        setIsLiveApiConnected(res.ok);
      } catch {
        setIsLiveApiConnected(false);
      }
    };
    checkConnection();
  }, [apiUrl]);

  const loginUser = async (email, otp, role = 'student') => {
    const data = await api.login(email, otp, role);
    setUser(data.profile);
    localStorage.setItem('FIXIT_USER', JSON.stringify(data.profile));
    return data.profile;
  };

  const loginAdmin = async (email, otp) => {
    const data = await api.adminLogin(email, otp);
    setUser(data.profile);
    localStorage.setItem('FIXIT_USER', JSON.stringify(data.profile));
    return data.profile;
  };

  const quickLoginAs = (role) => {
    let mockProfile;
    if (role === 'student') {
      mockProfile = {
        role: 'student',
        name: 'Mahesh Sharma',
        usn: '1CF24CS042',
        dept: 'CSE',
        email_id: 'mahesh.student@gmail.com',
        phone_number: '9876543210',
      };
      api.setToken(btoa(JSON.stringify({ email: mockProfile.email_id, role: 'student', time: Date.now() })));
    } else if (role === 'maintenance') {
      mockProfile = {
        role: 'office_staff',
        name: 'Kumar Gowda',
        dept: 'Campus Maintenance',
        designation: 'Supervisor',
        email_id: 'kumar.staff@gmail.com',
        phone_number: '9876543215',
      };
      api.setToken(btoa(JSON.stringify({ email: mockProfile.email_id, role: 'office_staff', time: Date.now() })));
    } else if (role === 'admin') {
      mockProfile = {
        role: 'admin',
        team_id: 'team29',
        institution_name: 'National Institute of Engineering',
        name: 'Chief Administrator',
        email_id: 'admin@team29.com',
        phone_number: '9876543200',
      };
      api.setToken(btoa(JSON.stringify({ email: mockProfile.email_id, role: 'admin', time: Date.now() })));
    }

    setUser(mockProfile);
    localStorage.setItem('FIXIT_USER', JSON.stringify(mockProfile));
    return mockProfile;
  };

  const logout = () => {
    setUser(null);
    api.setToken(null);
    localStorage.removeItem('FIXIT_USER');
  };

  const updateApiUrl = (url) => {
    api.setBaseUrl(url);
    setApiUrl(url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginUser,
        loginAdmin,
        quickLoginAs,
        logout,
        apiUrl,
        updateApiUrl,
        isLiveApiConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

