// src/components/Footer.tsx
import React, { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer style={{ display: 'flex', justifyContent: 'space-between', padding: '1em', background: '#0a2d5e', color: '#fff' }}>
      <a href="/">
        <img src="/path-to-your-logo.png" alt="Logo" />
      </a>
      <nav style={{ display: 'flex', gap: '1em' }}>
        <a href="/marketplace" style={{ color: '#fff', textDecoration: 'none' }}>Marketplace</a>
        <a href="/about" style={{ color: '#fff', textDecoration: 'none' }}>About</a>
        <a href="/docs" style={{ color: '#fff', textDecoration: 'none' }}>Docs</a>
      </nav>
      <div>
        <a href="https://twitter.com/yourtwitter" style={{ color: '#fff', textDecoration: 'none' }}>Twitter</a>
        <a href="https://github.com/yourgithub" style={{ color: '#fff', textDecoration: 'none' }}>GitHub</a>
      </div>
      <p>© 2023 MedChain. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
