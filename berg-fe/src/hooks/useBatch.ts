import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBatchesByProjectId, clearBatches } from '../features/batch/batchSlice';
import type { RootState, AppDispatch } from '../app/store';

export const useBatches = (projectId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    batches,
    loading,
    error
  } = useSelector((state: RootState) => state.batch);

  // Fetch batches when projectId changes
  useEffect(() => {
    if (projectId) {
      dispatch(getBatchesByProjectId(projectId));
    } else {
      dispatch(clearBatches());
    }
  }, [projectId, dispatch]);

  const refreshBatches = () => {
    if (projectId) {
      dispatch(getBatchesByProjectId(projectId));
    }
  };

  return {
    batches,
    loading,
    error,
    refreshBatches
  };
};