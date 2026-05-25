import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);     
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, ...user } = res.data;
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    setUser(user);

  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    const { token, ...user } = res.data;
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)