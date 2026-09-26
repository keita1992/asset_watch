import { DashboardOutlined, PersonOutline, TableChartOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Snackbar } from '../elements/Snackbar';

const menus = [
  { href: '/', label: 'ダッシュボード', icon: <DashboardOutlined fontSize="small" /> },
  { href: '/manage', label: 'データ管理', icon: <TableChartOutlined fontSize="small" /> },
  { href: '/profile', label: 'プロフィール', icon: <PersonOutline fontSize="small" /> },
];

type Props = {
  children: React.ReactNode,
}

export const Layout = ({ children }: Props) => {
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
      <Box
        component="nav"
        aria-label="メインメニュー"
        sx={{
          width: { md: 200 },
          flexShrink: 0,
          p: { xs: '12px 16px', md: '24px 12px' },
          bgcolor: 'var(--surface)',
          borderRight: { md: '1px solid var(--line)' },
          borderBottom: { xs: '1px solid var(--line)', md: 0 },
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          alignItems: { xs: 'center', md: 'stretch' },
          gap: '4px',
          overflowX: 'auto',
        }}
      >
        <Box sx={{ fontSize: 14, lineHeight: '20px', fontWeight: 600, px: '12px', pb: { md: '20px' }, whiteSpace: 'nowrap' }}>
          Asset Watch
        </Box>
        {menus.map((menu) => {
          const current = router.pathname === menu.href;
          return (
            <Box
              key={menu.href}
              component={Link}
              href={menu.href}
              aria-current={current ? 'page' : undefined}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: 36,
                px: '12px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                fontSize: 13,
                fontWeight: current ? 600 : 500,
                color: current ? 'var(--accent)' : 'var(--ink-2)',
                bgcolor: current ? 'var(--accent-soft)' : 'transparent',
                '&:hover': { bgcolor: current ? 'var(--accent-soft)' : 'var(--surface-sunken)', color: current ? 'var(--accent)' : 'var(--ink)' },
                '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: '2px' },
              }}
            >
              {menu.icon}
              {menu.label}
            </Box>
          );
        })}
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
        {children}
      </Box>
      <Snackbar />
    </Box>
  );
}

export default Layout;
