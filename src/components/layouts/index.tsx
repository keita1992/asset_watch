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
import React from 'react';

import { Snackbar } from '../elements/Snackbar';

import { ColorMode, useColorMode } from '@/libs/colorMode';

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

// メニューは幅 900px 以上で左、600〜899px で上、600px 未満で画面下のタブ（src/styles/components.css の .aw-nav）
export const Layout = ({ children }: Props) => {
  const router = useRouter();
  const { mode, setMode } = useColorMode();
  const colorMode = COLOR_MODES[mode];

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
      </nav>
      <main className="aw-main">{children}</main>
      <Snackbar />
    </div>
  );
}

export default Layout;
