import Head from 'next/head';
import NavBar from '../components/navigation/NavBar';

import '../styles/globals.css';

export default function App({Component, pageProps}){
  return(
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  )
}