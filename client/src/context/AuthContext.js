// client/src/context/AuthContext.js
import { createContext, useContext, useEffect, useState, useReducer } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js App Router

// Create the context
const AuthContext = createContext();

// Initial state for the reducer
const initialState = {
  user: null,
  token: null, // Initialize as null on both server and client
  loading: false,
  error: null,
  isClient: false, // Add a state to track if we're on the client
};

// Reducer for more complex state management (optional, useState works too)
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, user: null, token: null, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null, error: null };
    case 'SET_USER_FROM_STORAGE':
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'SET_IS_CLIENT':
      return { ...state, isClient: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // Use the reducer with the initial state and the main reducer function
  const [state, dispatch] = useReducer(authReducer, initialState);

  const router = useRouter();

  // Load user and token from localStorage ONLY on the client side
  useEffect(() => {
    // Mark that we are now on the client
    dispatch({ type: 'SET_IS_CLIENT', payload: true });

    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user'); // This might be null initially

    // FIX: Check if 'user' is not null before parsing
    if (token && user) { // Both token and user must exist
      try {
        const parsedUser = JSON.parse(user);
        dispatch({ type: 'SET_USER_FROM_STORAGE', payload: { token, user: parsedUser } });
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
        // Optionally, clear invalid data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Destructure individual state values from the state object returned by useReducer
  const { user, token, loading, error, isClient } = state;

  const login = async (email, password) => {
    if (!isClient) {
      console.error("Login attempted before client-side initialization");
      return;
    }

    dispatch({ type: 'LOGIN_START' });

    try {
      // CHANGE THIS: Use the full URL to your Flask backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Attempt to parse JSON

      if (response.ok) {
        const { access_token, user } = data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({ type: 'LOGIN_SUCCESS', payload: { token: access_token, user } });
        router.push('/Dashboard'); // Navigate to dashboard
      } else {
        // Server responded with an error status (e.g., 400, 401, 500)
        // data should contain the error message from your backend
        dispatch({ type: 'LOGIN_FAILURE', payload: data.error || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      // This handles network errors (e.g., server down, fetch failed)
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error or server unavailable' });
    }
  };

  const register = async (name, email, password) => {
    if (!isClient) {
      console.error("Register attempted before client-side initialization");
      return;
    }

    dispatch({ type: 'LOGIN_START' }); // Reuse loading state

    try {
      // CHANGE THIS: Use the full URL to your Flask backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json(); // Attempt to parse JSON

      if (response.ok) {
        const { access_token, user } = data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({ type: 'LOGIN_SUCCESS', payload: { token: access_token, user } });
        router.push('/Dashboard'); // Navigate to dashboard
      } else {
        // Server responded with an error status
        dispatch({ type: 'LOGIN_FAILURE', payload: data.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      // This handles network errors
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error or server unavailable' });
    }
  };

  const logout = () => {
    if (!isClient) {
      console.error("Logout attempted before client-side initialization");
      return;
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    router.push('/login');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Provide state and functions to child components
  // Only provide functions that require isClient check if needed, or wrap them
  // Here we check inside the functions themselves
  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      isClient, // Optionally expose isClient to components
      login,
      register,
      logout,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};