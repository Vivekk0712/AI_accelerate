import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '../../firebaseClient';
import { sessionLogin } from '../../services/authApi';
import { Loader2, XCircle } from 'lucide-react';

const GoogleSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if on mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Handle redirect result on component mount (for mobile)
  useEffect(() => {
    const handleRedirectResult = async () => {
      if (!auth) return;
      
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setIsLoading(true);
          console.log('Got redirect result, logging in...');
          const idToken = await result.user.getIdToken();
          
          const response = await sessionLogin(idToken);
          
          if (response.status === 200) {
            console.log('Login successful, redirecting...');
            window.location.href = '/#home';
          } else {
            throw new Error('Session login failed');
          }
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        if (error.code !== 'auth/missing-initial-state') {
          setError(`Failed to sign in: ${error.message || 'Please try again'}`);
        }
        setIsLoading(false);
      }
    };

    handleRedirectResult();
  }, []);

  const handleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!auth) {
        setError('Authentication is not configured. Please set Firebase env vars.');
        return;
      }
      
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Try popup first (works on most devices)
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const idToken = await userCredential.user.getIdToken();
        console.log('Got ID token from popup, calling session login...');
        
        const response = await sessionLogin(idToken);
        console.log('Session login response:', response.status);
        
        if (response.status === 200) {
          console.log('Login successful, redirecting...');
          // Use replace to force reload and ensure session is recognized
          window.location.replace('/#home');
        } else {
          throw new Error('Session login failed');
        }
      } catch (popupError: any) {
        // If popup fails on mobile, try redirect as fallback
        if (isMobile && (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user')) {
          console.log('Popup failed, trying redirect...');
          await signInWithRedirect(auth, provider);
          // Redirect will happen, no need to continue
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked. Please allow pop-ups and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Sign-in was cancelled. Please try again.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div style={{ flex: 1 }}>
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#4a5568',
          background: '#ffffff',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.borderColor = '#cbd5e0';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path 
                fill="#4285F4" 
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path 
                fill="#34A853" 
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path 
                fill="#FBBC05" 
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path 
                fill="#EA4335" 
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google</span>
          </>
        )}
      </button>
      
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          marginTop: '12px'
        }}>
          <XCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
        </div>
      )}
    </div>
  );
};

export default GoogleSignIn;
