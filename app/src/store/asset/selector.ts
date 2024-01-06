import { RootState } from '@/store';

export const selectIsAssetsFetched = (state: RootState) => state.asset.isAssetsFetched;
export const selectAssets = (state: RootState) => state.asset.assets;

