import { useDispatch } from 'react-redux';

import {
  SnackbarDuration,
  SnackbarMessage,
  IsSnackbarOpen,
  SnackbarSeverity,
  setIsSnackbarOpen,
  setSnackbarDuration,
  setSnackbarMessage,
  setSnackbarSeverity,
} from '@/store/ui';

export const useSetSnackbar = () => {
  const dispatch = useDispatch();

  const setSnackbar = (
    severity: SnackbarSeverity,
    message: SnackbarMessage,
    open: IsSnackbarOpen,
    duration?: SnackbarDuration
  ) => {
    if (open) {
      dispatch(setIsSnackbarOpen(false)); // すでに開いているものがあれば閉じる
      dispatch(setSnackbarMessage(message));
      dispatch(setSnackbarSeverity(severity));
      dispatch(setIsSnackbarOpen(true));
      dispatch(setSnackbarDuration(duration ?? 3000));
    } else {
      dispatch(setIsSnackbarOpen(false));
      dispatch(setSnackbarMessage(message));
    }
  };

  return setSnackbar;
};