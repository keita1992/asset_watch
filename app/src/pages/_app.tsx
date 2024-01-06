// pages/_app.tsx
import { ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import Layout from '@/components/layouts';


import { theme } from '@/libs/theme';
import { store } from '@/store';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <title>Asset Watch</title>
    <ThemeProvider theme={theme}>
      <ReduxProvider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ReduxProvider>
    </ThemeProvider>
  </>
);

export default App;
