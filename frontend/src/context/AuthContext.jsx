import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload,
        isAuthenticated: false 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      };
    case 'UPDATE_PROFILE':
      return { 
        ...state, 
        user: { ...state.user, ...action.payload } 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored auth data on mount (check both localStorage and sessionStorage)
    let storedUser = localStorage.getItem('doko_user');
    let storedToken = localStorage.getItem('doko_token');
    
    // If not found in localStorage, check sessionStorage
    if (!storedUser || !storedToken) {
      storedUser = sessionStorage.getItem('doko_user');
      storedToken = sessionStorage.getItem('doko_token');
    }
    
    if (storedUser && storedToken) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: JSON.parse(storedUser),
          token: storedToken
        }
      });
    }
  }, []);

  const login = async (email, password, role = 'customer', rememberMe = false) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login({ email, password });
      
      const { user, token } = response;
      
      // Store auth data
      if (rememberMe) {
        localStorage.setItem('doko_user', JSON.stringify(user));
        localStorage.setItem('doko_token', token);
      } else {
        sessionStorage.setItem('doko_user', JSON.stringify(user));
        sessionStorage.setItem('doko_token', token);
      }
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      toast.success(`Welcome back, ${user.name}!`);
      
    } catch (error) {
      const errorMessage = error.message || 'Invalid credentials. Please try again.';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.register(userData);
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: null
      });
      
      toast.success('Registration successful! Please login to continue.');
      return response;
      
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('doko_user');
      localStorage.removeItem('doko_token');
      sessionStorage.removeItem('doko_user');
      sessionStorage.removeItem('doko_token');
      
      dispatch({ type: 'LOGOUT' });
      toast.info('You have been logged out successfully.');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      const updatedUser = response.user;
      
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: updatedUser
      });
      
      // Update stored user data
      const storage = localStorage.getItem('doko_user') ? localStorage : sessionStorage;
      storage.setItem('doko_user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      return response;
      
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword
      });
      
      toast.success('Password changed successfully!');
      return response;
      
    } catch (error) {
      const errorMessage = error.message || 'Password change failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
