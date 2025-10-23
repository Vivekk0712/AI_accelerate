import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebaseClient';
import { sessionLogin } from '../../services/authApi';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface EmailAuthProps {
  isSignUp: boolean;
}

const EmailAuth = ({ isSignUp }: EmailAuthProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: '#ef4444' };
    if (password.length < 10) return { strength: 2, label: 'Medium', color: '#f59e0b' };
    return { strength: 3, label: 'Strong', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!auth) {
        setError('Authentication is not configured. Please set Firebase env vars.');
        return;
      }

      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const idToken = await userCredential.user.getIdToken();
      
      try {
        await sessionLogin(idToken);
        localStorage.setItem('firebaseToken', idToken);
      } catch (error) {
        console.error('Session login failed, using token fallback:', error);
        localStorage.setItem('firebaseToken', idToken);
      }
      
      // Force full page reload to home
      window.location.href = window.location.origin + '/#home';
      window.location.reload();
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try signing in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Try signing up instead.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a moment and try again.');
      } else {
        setError(isSignUp ? 'Failed to create account. Please try again.' : 'Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth}>
      {/* Name Field (Sign Up Only) */}
      {isSignUp && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#4a5568',
            marginBottom: '8px'
          }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nicholas Eregmia"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '15px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.2s',
              backgroundColor: isLoading ? '#f7fafc' : '#ffffff'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
      )}

      {/* Email Field */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: '#4a5568',
          marginBottom: '8px'
        }}>
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nicholas@eregmia.com"
          required
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            outline: 'none',
            transition: 'all 0.2s',
            backgroundColor: isLoading ? '#f7fafc' : '#ffffff'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Password Field */}
      <div style={{ marginBottom: isSignUp && password ? '8px' : '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: '#4a5568',
          marginBottom: '8px'
        }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingRight: '48px',
              fontSize: '15px',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.2s',
              backgroundColor: isLoading ? '#f7fafc' : '#ffffff'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#a0aec0',
              padding: '4px'
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Password Strength Indicator */}
      {isSignUp && password && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px'
          }}>
            <div style={{
              flex: 1,
              height: '4px',
              background: '#e2e8f0',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(passwordStrength.strength / 3) * 100}%`,
                height: '100%',
                background: passwordStrength.color,
                transition: 'all 0.3s'
              }} />
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: passwordStrength.color
            }}>
              {passwordStrength.label}
            </span>
          </div>
        </div>
      )}

      {/* Forgot Password (Sign In Only) */}
      {!isSignUp && (
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            Forgot your password?
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <XCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !email || !password}
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '15px',
          fontWeight: '600',
          color: '#ffffff',
          background: isLoading || !email || !password
            ? '#cbd5e0'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px',
          cursor: isLoading || !email || !password ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            {isSignUp ? 'Creating Account...' : 'Signing In...'}
          </>
        ) : (
          isSignUp ? 'Sign Up' : 'Sign In'
        )}
      </button>
    </form>
  );
};

export default EmailAuth;
