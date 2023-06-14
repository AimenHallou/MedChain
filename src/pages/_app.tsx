// src/pages/_app.tsx
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import type { AppProps } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../pages/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Header />
      <main className="bg-dark text-light">
        <Component {...pageProps} />
      </main>
      <Footer />
    </Provider>
  );
}

export default MyApp;
