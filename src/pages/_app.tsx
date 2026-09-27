// pages/_app.tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import React, { useMemo } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import Layout from '@/components/layouts';

import { ColorModeProvider, useColorMode } from '@/libs/colorMode';
import { createAppTheme } from '@/libs/theme';
import { store } from '@/store';

import '@/styles/tokens.css';
import '@/styles/components.css';

// MUI のテーマも、画面で選んだライト・ダークに合わせる
const Themed = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useColorMode();
  const theme = useMemo(() => createAppTheme(isDark ? 'dark' : 'light'), [isDark]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <title>Asset Watch</title>
    <ColorModeProvider>
      <Themed>
        <ReduxProvider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ReduxProvider>
      </Themed>
    </ColorModeProvider>
  </>
);

export default App;
