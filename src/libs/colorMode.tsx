import { useMediaQuery } from '@mui/material';
import React, { createContext, useContext, useEffect, useState } from 'react';

// system: OS の設定に合わせる / light・dark: 画面で選んだ方に固定する
export type ColorMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'aw-color-mode';

type Value = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  // 実際に表示しているのがダークかどうか
  isDark: boolean;
};

const ColorModeContext = createContext<Value>({ mode: 'system', setMode: () => {}, isDark: false });

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setModeState] = useState<ColorMode>('system');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') setModeState(saved);
    } catch {
      // 保存領域が使えないときは OS の設定に合わせる
    }
  }, []);

  // tokens.css は html の data-theme を見てライト・ダークの値を切り替える
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'system') delete root.dataset.theme;
    else root.dataset.theme = mode;
  }, [mode]);

  const setMode = (next: ColorMode) => {
    setModeState(next);
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 保存できなくても今の表示には反映する
    }
  };

  const isDark = mode === 'dark' || (mode === 'system' && prefersDark);

  return <ColorModeContext.Provider value={{ mode, setMode, isDark }}>{children}</ColorModeContext.Provider>;
};

export const useColorMode = () => useContext(ColorModeContext);
