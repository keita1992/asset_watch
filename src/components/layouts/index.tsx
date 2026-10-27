import {
  BrightnessAutoOutlined,
  DarkModeOutlined,
  DashboardOutlined,
  LightModeOutlined,
  PersonOutline,
  TableChartOutlined,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Snackbar } from '../elements/Snackbar';

import { axios } from '@/libs/axios';
import { ColorMode, useColorMode } from '@/libs/colorMode';
import { useAppSelector } from '@/store';
import { selectAssets } from '@/store/asset';
import { selectUser } from '@/store/user';
import { formatLastUpdated, latestUpdatedAt } from '@/utils/lastUpdated';

const menus = [
  { href: '/', label: 'ダッシュボード', icon: <DashboardOutlined /> },
  { href: '/manage', label: 'データ管理', icon: <TableChartOutlined /> },
  { href: '/profile', label: 'プロフィール', icon: <PersonOutline /> },
];

// 押すたびに 自動 → ライト → ダーク の順に切り替える
const COLOR_MODES: Record<ColorMode, { next: ColorMode; label: string; icon: React.ReactNode }> = {
  system: { next: 'light', label: '自動', icon: <BrightnessAutoOutlined /> },
  light: { next: 'dark', label: 'ライト', icon: <LightModeOutlined /> },
  dark: { next: 'system', label: 'ダーク', icon: <DarkModeOutlined /> },
};

type Props = {
  children: React.ReactNode,
}

const LastUpdated = ({ value, className }: { value: string | null; className: string }) => (
  <div className={`aw-last-updated ${className}`}>
    <span>最終更新日時</span>
    {value ? <time dateTime={value}>{formatLastUpdated(value)}</time> : <span>—</span>}
  </div>
);

// メニューは幅 900px 以上で左、600〜899px で上、600px 未満で画面下のタブ（src/styles/components.css の .aw-nav）
export const Layout = ({ children }: Props) => {
  const router = useRouter();
  const { mode, setMode } = useColorMode();
  const colorMode = COLOR_MODES[mode];
  const assets = useAppSelector(selectAssets);
  const user = useAppSelector(selectUser);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLastUpdatedAt(null);
    axios.get<{ lastUpdatedAt: string | null }>('/api/assets/last-updated')
      .then(({ data }) => {
        if (active) setLastUpdatedAt(latestUpdatedAt([data.lastUpdatedAt]));
      })
      .catch((error) => {
        console.error(error);
      });
    return () => { active = false; };
  }, [assets, user, router.pathname]);

  return (
    <div className="aw-shell">
      <nav className="aw-nav" aria-label="メインメニュー">
        <div className="aw-nav__brand">Asset Watch</div>
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className="aw-nav__item"
            aria-current={router.pathname === menu.href ? 'page' : undefined}
          >
            {menu.icon}
            <span>{menu.label}</span>
          </Link>
        ))}
        <span className="aw-nav__spacer" />
        <button
          type="button"
          className="aw-nav__item"
          onClick={() => setMode(colorMode.next)}
          aria-label={`表示テーマ: ${colorMode.label}（押すと${COLOR_MODES[colorMode.next].label}に切り替え）`}
        >
          {colorMode.icon}
          <span>{colorMode.label}</span>
        </button>
        <LastUpdated value={lastUpdatedAt} className="aw-last-updated--nav" />
      </nav>
      <main className="aw-main">
        <LastUpdated value={lastUpdatedAt} className="aw-last-updated--main" />
        {children}
      </main>
      <Snackbar />
    </div>
  );
}

export default Layout;
