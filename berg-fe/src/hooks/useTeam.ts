import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeams }  from '../features/team/teamSlice'; 
import type { RootState, AppDispatch } from '../app/store';

export const useTeams = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    teams,
    loading,
    error,
  } = useSelector((state: RootState) => state.team); 

  useEffect(() => {
    dispatch(getTeams());
  }, [dispatch]);

  return {
    teams,
    loading,
    error,
  };
};
