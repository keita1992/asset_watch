import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridValueFormatterParams, MuiBaseEvent, MuiEvent, jaJP } from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';

import { DeleteButton } from './DeleteButton';

import { Link } from '@/components/elements/Link';

import { useAppDispatch, useAppSelector } from '@/store';
import { Asset, selectAssets } from '@/store/asset';
import { editAsset } from '@/store/asset/operation';
import { setAssetId, setIsAssetModalOpen } from '@/store/ui';
import { formatCurrency } from '@/utils/formatter';


const StyledContainer = styled('div')(() => ({
  height: '80vh',
  width: '90%',
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '&.MuiDataGrid-root .MuiDataGrid-cell': {
    fontSize: '1.0rem',
  },
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '.MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '.MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.primary.main,
  },
}));

export const AssetTable = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectAssets);

  const [rows, setRows] = useState<Asset[]>([]);

  useEffect(() => {
    // 日本円現金は自動計算のため表示しない
    const data = Object.values(assets)
      .filter((asset) => !(asset.currency === 'JPY' && asset.category === '現金'))
      .map((asset) => {
        return {
          ...asset,
          createdAt: format(parseISO(asset.createdAt), 'yyyy/MM/dd'),
          updatedAt: format(parseISO(asset.updatedAt), 'yyyy/MM/dd'),
        };
      });
    setRows(data);
  }, [assets]);

  const handleEditClick = (id: string) => {
    dispatch(setAssetId(id));
    dispatch(setIsAssetModalOpen(true));
  }

  const renderWrapText = (params: GridRenderCellParams) => {
    return (
      <Box
        sx={{
          py: 1,
          whiteSpace: 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {params.value}
      </Box>
    );
  };

  const renderName = (params: GridRenderCellParams) => {
    return (
      <Box
        sx={{
          py: 1,
          whiteSpace: 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <Link
          onClick={() => handleEditClick(params.row.id)}
        >
          {params.value}
        </Link>
      </Box>
    );
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 10, disableExport: true },
    {
      field: 'name',
      headerName: '資産名',
      width: 300,
      renderCell: renderName
    },
    {
      field: 'currency',
      headerName: '通貨',
      width: 150,
      renderCell: renderWrapText,
    },
    {
      field: 'category',
      headerName: '資産クラス',
      width: 150,
      renderCell: renderWrapText,
    },
    {
      field: 'amount',
      headerName: '評価額',
      width: 150,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return formatCurrency(params.value as number);
      },
      editable: true,
    },
    {
      field: 'createdAt',
      headerName: '作成日',
      width: 130,
    },
    {
      field: 'updatedAt',
      headerName: '更新日',
      width: 130,
    },
    {
      field: 'delete',
      headerName: '削除',
      width: 100,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params: GridRenderCellParams) => (<DeleteButton id={params.row.id} />)
    }
  ];

  const handleEditCellStop = async (
    params: GridCellParams,
    event: MuiEvent<MuiBaseEvent>,
  ) => {
    const { field, row } = params;
    if (field !== 'amount') {
      return;
    }
    const newValue = (event as React.ChangeEvent<HTMLInputElement>).target.value;
    if (isNaN(Number(newValue))) {
      return;
    }
    const newAsset = { ...row, [field]: Number(newValue) } as Asset;
    try {
      dispatch(editAsset(newAsset.id, newAsset));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledContainer>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        getRowHeight={() => 'auto'}
        localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
        disableRowSelectionOnClick
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        onCellEditStop={handleEditCellStop}
      />
    </StyledContainer>
  );
};