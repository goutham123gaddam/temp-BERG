import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  clearErrors, 
  clearTasks 
} from '../features/task/taskSlice';
import type { RootState, AppDispatch } from '../app/store';

export const useTasks = (batchId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    items: tasks,
    loading,
    error,
    isCreateLoading,
    isCreateError,
    isUpdateLoading,
    isUpdateError,
    isDeleteLoading,
    isDeleteError
  } = useSelector((state: RootState) => state.tasks);

  // Fetch tasks when batchId changes
  useEffect(() => {
    if (batchId) {
      dispatch(fetchTasks(batchId));
    } else {
      dispatch(clearTasks());
    }
  }, [batchId, dispatch]);

  // Task actions
  const handleCreateTask = async (taskData: any) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleUpdateTask = async (id: string, taskData: any) => {
    try {
      await dispatch(updateTask({ id, data: taskData })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleClearErrors = () => {
    dispatch(clearErrors());
  };

  const refreshTasks = () => {
    if (batchId) {
      dispatch(fetchTasks(batchId));
    }
  };

  return {
    tasks,
    loading,
    error,
    isCreateLoading,
    isCreateError,
    isUpdateLoading,
    isUpdateError,
    isDeleteLoading,
    isDeleteError,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleClearErrors,
    refreshTasks
  };
};