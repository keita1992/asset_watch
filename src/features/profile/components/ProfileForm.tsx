import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useSetSnackbar } from '@/hooks/useSetSnackbar';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectUser, Request } from '@/store/user';
import { editUser } from '@/store/user/operation';

const schema = yup.object({
  name: yup.string().required('入力してください'),
  netAssets: yup
    .number()
    .typeError('整数を入力してください')
    .integer('整数を入力してください')
    .min(0, '0以上の数字を入力してください')
    .required('入力してください'),
  liabilities: yup
    .number()
    .typeError('整数を入力してください')
    .integer('整数を入力してください')
    .min(0, '0以上の数字を入力してください')
    .required('入力してください'),
  emergencyFund: yup
    .number()
    .typeError('整数を入力してください')
    .integer('整数を入力してください')
    .min(0, '0以上の数字を入力してください')
    .required('入力してください'),
});

export const ProfileForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [processing, setIsProcessing] = useState(false);
  const setSnackbar = useSetSnackbar();

  const defaultValues = {
    name: user.name,
    netAssets: user.netAssets,
    liabilities: user.liabilities,
    emergencyFund: user.emergencyFund,
  } as Request;

  const options = {
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange' as const,
  };

  const {
    handleSubmit,
    formState: { errors, isDirty },
    register,
  } = useForm<Request>(options);

  const onSubmit = async (data: Request) => {
    try {
      setIsProcessing(true);
      await dispatch(editUser(data));
      setSnackbar('success', '登録しました', true);
    } catch (e) {
      setSnackbar('error', '登録に失敗しました', true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Stack
      component="form"
      spacing={5}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '70%' }}
    >
      {/* 名前 */}
      <FormControl required>
        <InputLabel>名前</InputLabel>
        <OutlinedInput
          required
          autoComplete="off"
          label="名前"
          error={'name' in errors}
          {...register('name')}
        />
        <FormHelperText error>{errors?.name?.message ?? ''}</FormHelperText>
      </FormControl>

      {/* 総資産 */}
      <FormControl required>
        <InputLabel>総資産</InputLabel>
        <OutlinedInput
          required
          autoComplete="off"
          label="総資産"
          error={'netAssets' in errors}
          startAdornment={<InputAdornment position="start">¥</InputAdornment>}
          {...register('netAssets')}
        />
        <FormHelperText error>{errors?.netAssets?.message ?? ''}</FormHelperText>
      </FormControl>

      {/* 総負債 */}
      <FormControl required>
        <InputLabel>総負債</InputLabel>
        <OutlinedInput
          required
          autoComplete="off"
          label="総負債"
          error={'liabilities' in errors}
          startAdornment={<InputAdornment position="start">¥</InputAdornment>}
          {...register('liabilities')}
        />
        <FormHelperText error>{errors?.liabilities?.message ?? ''}</FormHelperText>
      </FormControl>

      {/* 生活防衛資金 */}
      <FormControl required>
        <InputLabel>生活防衛資金</InputLabel>
        <OutlinedInput
          required
          autoComplete="off"
          label="生活防衛資金"
          error={'emergencyFund' in errors}
          startAdornment={<InputAdornment position="start">¥</InputAdornment>}
          {...register('emergencyFund')}
        />
        <FormHelperText error>{errors?.emergencyFund?.message ?? ''}</FormHelperText>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={processing || !isDirty || Object.keys(errors).length > 0}
      >
        更新する
      </Button>
    </Stack>
  );
};