// src/pages/_app.tsx
import { useState } from 'react';
import { Provider } from "react-redux";
import { store } from "../redux/store";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../pages/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const pagePropsWithSearch = {
    ...pageProps,
    searchTerm,
  };

  return (
    <Provider store={store}>
      <Header onSearch={handleSearch} />
      <main className="bg-dark text-light">
        <Component {...pagePropsWithSearch} />
      </main>
      <Footer />
    </Provider>
  );
}

export default MyApp;
