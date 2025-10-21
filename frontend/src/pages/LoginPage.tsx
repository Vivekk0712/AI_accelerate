import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailAuth from '../components/auth/EmailAuth';
import GoogleSignIn from '../components/auth/GoogleSignIn';
import PhoneAuth from '../components/auth/PhoneAuth';
import { auth } from '../firebaseClient';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* Header Section */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 32px',
            position: 'relative'
          }}>
            {/* Back Button */}
            <button
              onClick={() => window.location.hash = '#home'}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 12px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <ArrowLeft size={18} />
            </button>

            {/* Sign Up Link */}
            {!isSignUp && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                  Don't have an account?
                </span>
                <button
                  onClick={() => setIsSignUp(true)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 16px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}

            {isSignUp && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
                  Already have an account?
                </span>
                <button
                  onClick={() => setIsSignUp(false)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 16px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Logo/Title */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <h1 style={{
                color: '#ffffff',
                fontSize: '36px',
                fontWeight: '700',
                margin: '0',
                letterSpacing: '-0.5px'
              }}>
                AI Assistant
              </h1>
            </div>
          </div>

          {/* Form Section */}
          <div style={{ padding: '40px 32px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Title */}
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1a202c',
                    margin: '0 0 8px 0'
                  }}>
                    {isSignUp ? 'Get started free.' : 'Welcome Back'}
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: '#718096',
                    margin: '0'
                  }}>
                    {isSignUp ? 'Free forever. No credit card needed.' : 'Enter your details below'}
                  </p>
                </div>

                {/* Login Method Toggle */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '24px',
                  padding: '4px',
                  background: '#f7fafc',
                  borderRadius: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: loginMethod === 'email' ? '#ffffff' : '#718096',
                      background: loginMethod === 'email' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: loginMethod === 'phone' ? '#ffffff' : '#718096',
                      background: loginMethod === 'phone'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Phone
                  </button>
                </div>

                {/* Auth Form */}
                {loginMethod === 'email' ? (
                  <EmailAuth isSignUp={isSignUp} />
                ) : (
                  <PhoneAuth />
                )}

                {/* Divider */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '24px 0',
                  gap: '16px'
                }}>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                  <span style={{ fontSize: '13px', color: '#a0aec0', fontWeight: '500' }}>
                    Or continue with
                  </span>
                  <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                </div>

                {/* Social Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <GoogleSignIn />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Firebase Warning */}
            {!auth && (
              <div style={{
                marginTop: '20px',
                padding: '12px 16px',
                background: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#d97706'
              }}>
                ⚠️ Authentication not configured. Set Firebase env vars to enable sign-in.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
