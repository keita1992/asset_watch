import { Box, Button, Modal as MuiModal } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

const Content = styled('div')(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  overflow: 'scroll',
  padding: theme.spacing(2, 5, 3),
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

interface Props {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  width?: string;
  height?: string;
  maxWidth?: string;
  isOpen?: boolean;
}

export const Modal = (props: Props) => {
  const {
    children,
    open,
    onClose,
    width = '60%',
    height = '60%',
    maxWidth = '700px',
  } = props;

  return (
    <MuiModal disableAutoFocus open={open} onClose={onClose} sx={{ p: 3 }}>
      <Content
        sx={{
          height: height,
          width: width,
          maxWidth: maxWidth,
        }}
      >
        <Box sx={{ textAlign: 'right' }}>
          <Button onClick={onClose} color="inherit" variant="outlined">
            閉じる
          </Button>
        </Box>
        <Box>{children}</Box>
      </Content>
    </MuiModal>
  );
};