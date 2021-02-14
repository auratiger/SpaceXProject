import Head from 'next/head';
import NavBar from '../components/navigation/NavBar';
import { LaunchProvider } from '../contexts/LauncesContext';

import '../styles/globals.css';

export default function App({Component, pageProps}){
  return(
    <LaunchProvider>
      <NavBar />
      <Component {...pageProps} />
    </LaunchProvider>
  )
}