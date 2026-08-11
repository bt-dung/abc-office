"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

export default function LoginPage() {
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again.');
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={`${styles.authContainer} ${isSignUp ? styles.isActive : ''}`}>
        <div className={`${styles.formContainer} ${styles.signIn}`}>
          <form onSubmit={handleLogin} className={styles.authContainer_form}>
            <h1 className={styles.authContainer_title}>Sign In</h1>
            <div className={styles.socialIcons}>
              <a><FontAwesomeIcon icon={faGooglePlusG} /></a>
              <a><FontAwesomeIcon icon={faFacebookF} /></a>
              <a><FontAwesomeIcon icon={faGithub} /></a>
              <a><FontAwesomeIcon icon={faLinkedinIn} /></a>
            </div>
            <span className={styles.subtitle}>or use your account</span>
            <input
              type="text"
              placeholder="Username hoặc Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={styles.authContainer_input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.authContainer_input}
            />
            <a href="#" className={styles.forgotPassword}>Forgot your password?</a>
            <button type="submit" className={styles.btnSignIn}>Sign In</button>
          </form>
        </div>
        <div className={`${styles.formContainer} ${styles.signUp}`}>
          <form onSubmit={handleRegister} className={styles.authContainer_form}>
            <h1 className={styles.authContainer_title}>Create Account</h1>
            <div className={styles.socialIcons}>
              <a>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </a>
              <a>
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a>
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a>
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
            <span className={styles.subtitle}>or use your email for registration</span>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.authContainer_input}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.authContainer_input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.authContainer_input}
            />
            <button type="submit" className={styles.btnSignIn}>Sign Up</button>
          </form>
        </div>
        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>
            <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
              <h1>Welcome Back!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className={styles.hidden} id="login" onClick={() => setIsSignUp(false)}>Sign In</button>
            </div>
            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h1>Hello, Friend!</h1>
              <p>Register with your personal detail to use all of site features</p>
              <button className={styles.hidden} id="register" onClick={() => setIsSignUp(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}