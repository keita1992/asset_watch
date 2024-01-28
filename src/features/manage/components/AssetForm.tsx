import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Modal } from '@/components/elements/Modal';

import { useSetSnackbar } from '@/hooks/useSetSnackbar';
import { useAppDispatch, useAppSelector } from '@/store';
import { Category, Currency, Request, selectAssets } from '@/store/asset';
import { addAsset, editAsset } from '@/store/asset/operation';
import {
  selectAssetId,
  selectIsAssetModalOpen,
  setIsAssetModalOpen,
} from '@/store/ui';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('入力してください')
    .max(256, '256文字以内で入力してください'),
  currency: yup
    .mixed<Currency>()
    .oneOf(['JPY', 'USD', 'EUR', 'CHF', 'AUD', 'CAD', 'HKD', 'CNY', 'INR'], '選択してください')
    .required('入力してください'),
  category: yup
    .mixed<Category>()
    .oneOf(
      ['日本株', '米国株', '中国株', 'インド株', '債券', '投資信託', 'コモディティ', '現金', 'その他'],
      '選択してください'
    )
    .required('入力してください'),
  amount: yup
    .number()
    .typeError('整数を入力してください')
    .integer('整数を入力してください')
    .min(0, '0以上の数字を入力してください')
    .required('入力してください'),
}).test(
  'is-jpy-and-cash',
  'JPY currency cannot be used with cash category',
  function (value, context) {
    if (value.currency === 'JPY' && value.category === '現金') {
      return context.createError({
        path: 'category', // このフィールドにエラーを割り当てる
        message: '※ 日本円の現金は「総資産 - 負債 - 現金以外の資産」で自動計算されます。'
      });
    }
    return true;
  }
);
export const AssetForm = () => {
  const dispatch = useAppDispatch();

  const id = useAppSelector(selectAssetId);
  const assets = useAppSelector(selectAssets);
  const open = useAppSelector(selectIsAssetModalOpen);

  const [processing, setIsProcessing] = useState(false);
  const setSnackbar = useSetSnackbar();

  const defaultValues = {
    name: '',
    currency: 'JPY',
    category: '日本株',
    amount: 0,
  } as Request;

  const options = {
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange' as const,
  };

  const {
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    register,
    control,
  } = useForm<Request>(options);

  const handleClose = () => {
    dispatch(setIsAssetModalOpen(false));
  };

  const onSubmit = async (data: Request) => {
    try {
      setIsProcessing(true);
      if (id === null) {
        await dispatch(addAsset(data));
      } else {
        await dispatch(editAsset(id, data));
      }
      handleClose();
      setSnackbar('success', '登録しました', true);
    } catch (e) {
      setSnackbar('error', '登録に失敗しました', true);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (id) {
      const asset = assets[id];
      reset({
        name: asset.name,
        currency: asset.currency,
        category: asset.category,
        amount: asset.amount,
      });
    } else {
      reset(defaultValues);
    }
  }, [open, id]);

  return (
    <Modal open={open} onClose={handleClose} height="80%">
      <Typography variant="h6" sx={{ mb: 2 }}>
        {id === null ? '新規追加' : '編集'}
      </Typography>
      <Stack
        component="form"
        spacing={5}
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: '70%' }}
      >
        {/* 資産名 */}
        <FormControl>
          <TextField
            required
            autoComplete="off"
            label="資産名"
            error={'question' in errors}
            helperText={errors?.name?.message ?? ''}
            {...register('name')}
          />
        </FormControl>

        {/* 通貨 */}
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <FormControl>
              <InputLabel>通貨</InputLabel>
              <Select {...field} label="通貨" error={'currency' in errors}>
                <MenuItem value="JPY">JPY</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="CHF">CHF</MenuItem>
                <MenuItem value="AUD">AUD</MenuItem>
                <MenuItem value="CAD">CAD</MenuItem>
                <MenuItem value="HKD">HKD</MenuItem>
                <MenuItem value="CNY">CNY</MenuItem>
                <MenuItem value="INR">INR</MenuItem>
              </Select>
              <FormHelperText error>
                {errors?.currency?.message ?? ''}
              </FormHelperText>
            </FormControl>
          )}
        />

        {/* 施策クラス */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormControl required>
              <InputLabel>資産クラス</InputLabel>
              <Select {...field} label="資産クラス" error={'category' in errors}>
                <MenuItem value="日本株">日本株</MenuItem>
                <MenuItem value="米国株">米国株</MenuItem>
                <MenuItem value="中国株">中国株</MenuItem>
                <MenuItem value="インド株">インド株</MenuItem>
                <MenuItem value="債券">債券</MenuItem>
                <MenuItem value="投資信託">投資信託</MenuItem>
                <MenuItem value="コモディティ">コモディティ</MenuItem>
                <MenuItem value="現金">現金</MenuItem>
                <MenuItem value="その他">その他</MenuItem>
              </Select>
              <FormHelperText error>
                {errors?.category?.message ?? ''}
              </FormHelperText>
            </FormControl>
          )}
        />

        {/* 評価額 */}
        <FormControl required>
          <InputLabel>評価額</InputLabel>
          <OutlinedInput
            required
            autoComplete="off"
            label="評価額"
            error={'amount' in errors}
            startAdornment={<InputAdornment position="start">¥</InputAdornment>}
            {...register('amount')}
          />
          <FormHelperText error>{errors?.amount?.message ?? ''}</FormHelperText>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={processing || !isDirty || Object.keys(errors).length > 0}
        >
          {id === null ? '新規追加する' : '更新する'}
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1" color="text.secondary">
        ※ 日本円の現金は「総資産 - 負債 - 現金以外の資産」で自動計算されます。
      </Typography>
    </Modal>
  );
};