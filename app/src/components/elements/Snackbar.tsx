// このコンポーネントはLayoutに1つ配置しています
// useSnackbar(カスタムhooks)を使うと、このコンポーネントを使わなくてもSnackbarを表示できます

import MuiAlert, { AlertProps } from '@mui/material/Alert';
import MuiSnackbar from '@mui/material/Snackbar';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/store';
import {
  selectIsSnackbarOpen,
  selectSnackbarDuration,
  selectSnackbarMessage,
  selectSnackbarSeverity,
  setIsSnackbarOpen,
} from '@/store/ui';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Snackbar = () => {
  const dispatch = useDispatch();

  const open = useAppSelector(selectIsSnackbarOpen);
  const message = useAppSelector(selectSnackbarMessage);
  const severity = useAppSelector(selectSnackbarSeverity);
  const duration = useAppSelector(selectSnackbarDuration);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setIsSnackbarOpen(false));
  };

  return (
    <MuiSnackbar open={open} autoHideDuration={duration} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%', color: '#fff' }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};