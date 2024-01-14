import { Link as MuiLink, styled } from '@mui/material';

export const Link = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.link.main,
  cursor: 'pointer',
}));
