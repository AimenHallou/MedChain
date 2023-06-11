// src/components/Header.tsx
import React, { FC } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';

const Header: FC = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1em', background: '#0a2d5e' }}>
      <Link href="/">
        <h1 style={{ color: '#fff', textDecoration: 'none' }}>MedChain</h1>
      </Link>
      <SearchBar />
      <nav style={{ display: 'flex', gap: '1em' }}>
        <Link href="/">
          <span style={{ color: '#fff', textDecoration: 'none' }}>Marketplace</span>
        </Link>
        <Link href="/about">
          <span style={{ color: '#fff', textDecoration: 'none' }}>About</span>
        </Link>
        <Link href="/docs">
          <span style={{ color: '#fff', textDecoration: 'none' }}>Docs</span>
        </Link>
        <Link href="/publish">
          <span style={{ color: '#fff', textDecoration: 'none' }}>Publish Data</span>
        </Link>
        <Link href="/account">
          <span style={{ color: '#fff', textDecoration: 'none' }}>Account</span>
        </Link>
      </nav>
      <button style={{ padding: '0.5em 1em', background: '#0077b6', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Connect Wallet
      </button>
    </header>
  );
}

export default Header;
