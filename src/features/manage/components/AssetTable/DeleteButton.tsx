import { Button } from "@mui/material";

import { useSetSnackbar } from "@/hooks/useSetSnackbar";
import { useAppDispatch } from "@/store";
import { deleteAsset } from "@/store/asset/operation";

type Props = {
  id: string;
};

export const DeleteButton = ({ id }: Props) => {
  const dispatch = useAppDispatch();
  const setSnackbar = useSetSnackbar();

  const handleClick = async () => {
    try {
      if (confirm('本当に削除しますか？')) {
        await dispatch(deleteAsset(id));
        setSnackbar('success', '削除しました', true, 3000);
      }
    } catch (err) {
      setSnackbar('error', '削除に失敗しました', true);
    }
  }

  return (
    <Button variant="outlined" color="error" onClick={handleClick} sx={{ my: 1 }}>
      削除
    </Button>
  )
}