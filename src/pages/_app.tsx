// pages/_app.tsx
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { AppProps } from 'next/app';
import React, { useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import Layout from '@/components/layouts';

import { createAppTheme } from '@/libs/theme';
import { store } from '@/store';

import '@/styles/tokens.css';
import '@/styles/components.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => createAppTheme(prefersDark ? 'dark' : 'light'), [prefersDark]);

  return (
    <>
      <title>Asset Watch</title>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReduxProvider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ReduxProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
