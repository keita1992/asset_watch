import { Button } from "@mui/material"

import { useAppDispatch } from "@/store"
import { setAssetId, setIsAssetModalOpen } from "@/store/ui";

export const AddButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setIsAssetModalOpen(true));
    dispatch(setAssetId(null));
  }

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      新規追加
    </Button>
  )
}