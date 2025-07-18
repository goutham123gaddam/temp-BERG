import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { getBatchesByProjectId, clearBatches } from '../features/batch/batchSlice';

export const useBatches = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { batches, loading, error } = useSelector((state: RootState) => state.batch);

  const fetchBatches = (projectId: string) => {
    dispatch(getBatchesByProjectId(projectId));
  };

  const resetBatches = () => {
    dispatch(clearBatches());
  };

  return {
    batches,
    loading,
    error,
    fetchBatches,
    resetBatches,
  };
};
