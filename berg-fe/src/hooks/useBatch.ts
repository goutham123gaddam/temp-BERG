import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBatchesByProjectId,
  clearBatches,
  createdBatch,
  deleteBatch
} from '../features/batch/batchSlice';
import type { RootState, AppDispatch } from '../app/store';

// Inline Batch type (adjust based on your backend response)
interface Batch {
  id: string;
  batchName: string;
  dueDate: string;
  slaStatus?: string;
  progress?: number;
  accuracy?: number;
  createdAt?: string;
  totalTasks?: number;
  completedTasks?: number;
  pendingTasks?: number;
  inProgressTasks?: number;
}

// Payload type for creating a batch
interface CreateBatchPayload {
  projectId: string;
  batchName: string;
  dueDate: string;
}

// Return type of the hook
interface UseBatchesReturn {
  batches: Batch[];
  loading: boolean;
  error: string | null;
  refreshBatches: () => void;
  createBatch: (payload: CreateBatchPayload) => void;
  removeBatch: (batchId: string) => void;
}

export const useBatches = (projectId?: string): UseBatchesReturn => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    batches,
    loading,
    error,
  } = useSelector((state: RootState) => state.batch);

  // Fetch batches on projectId change
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

  const createBatch = (payload: CreateBatchPayload) => {
    dispatch(createdBatch(payload));
  };

  const removeBatch = (batchId: string) => {
    dispatch(deleteBatch(batchId));
  };

  return {
    batches: batches as Batch[],
    loading,
    error,
    refreshBatches,
    createBatch,
    removeBatch,
  };
};
