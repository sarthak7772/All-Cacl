 import type { AppProps } from "next/app";
 import Head from "next/head";
import "../styles/globals.css"; // Make sure you have this CSS file

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>All Calculatorsr</title>
        <meta name="description" content="Take control of your menstrual health with intelligent tracking, personalized insights, and complete privacy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FlowCare - Period Tracker" />
        <meta property="og:description" content="Take control of your menstrual health with intelligent tracking, personalized insights, and complete privacy." />
         <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="FlowCare - Period Tracker" />
        <meta property="twitter:description" content="Take control of your menstrual health with intelligent tracking, personalized insights, and complete privacy." />
         <meta property="twitter:image" content="/og-image.png" />
        
         {/* Additional meta tags */}
         <meta name="theme-color" content="#ec4899" />
         <meta name="keywords" content="period tracker, menstrual health, women's health, cycle tracking, fertility" />
       </Head>
      
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;