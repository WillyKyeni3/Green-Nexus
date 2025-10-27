// client/src/context/AuthContext.js
import { createContext, useContext, useEffect, useState, useReducer } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js App Router

// Create the context
const AuthContext = createContext();

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
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('access_token'), // Initialize token from storage
    loading: false,
    error: null,
  });

  const router = useRouter();

  // Load user and token from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user'); // Assuming you also store user info

    if (token && user) {
      try {
        // Parse user data from localStorage
        const parsedUser = JSON.parse(user);
        // Dispatch action to set user and token in state
        dispatch({ type: 'SET_USER_FROM_STORAGE', payload: { token, user: parsedUser } });
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
        // Optionally, clear invalid data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Function to login
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch('/api/auth/login', { // Use your actual backend URL if different
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Store token and user in localStorage and update state
        const { access_token, user } = data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user)); // Store user info too

        dispatch({ type: 'LOGIN_SUCCESS', payload: { token: access_token, user } });
        router.push('/'); // Redirect to dashboard
      } else {
        // Failure: Update state with error
        dispatch({ type: 'LOGIN_FAILURE', payload: data.error || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error or server unavailable' });
    }
  };

  // Function to register (similar to login)
  const register = async (name, email, password) => {
    dispatch({ type: 'LOGIN_START' }); // Reuse loading state

    try {
      const response = await fetch('/api/auth/register', { // Use your actual backend URL if different
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Store token and user in localStorage and update state
        // Note: Registration might not return a token immediately, depending on your backend logic.
        // If registration auto-logs in, use the same logic as login.
        // If not, you might just show a success message and redirect to login.
        // For this example, assuming registration auto-logs in:
        const { access_token, user } = data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({ type: 'LOGIN_SUCCESS', payload: { token: access_token, user } });
        router.push('/'); // Redirect to dashboard
      } else {
        // Failure: Update state with error
        dispatch({ type: 'LOGIN_FAILURE', payload: data.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error or server unavailable' });
    }
  };

  // Function to logout
  const logout = () => {
    // Clear data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    // Update state
    dispatch({ type: 'LOGOUT' });
    router.push('/login'); // Redirect to login page
  };

  // Function to clear error message
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Provide state and functions to child components
  return (
    <AuthContext.Provider value={{
      ...state, // Spread user, token, loading, error
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