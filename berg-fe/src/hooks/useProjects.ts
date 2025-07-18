// src/hooks/useProjects.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, createProjects } from '../features/project/projectSlice';
import type { RootState, AppDispatch } from '../app/store';

export const useProjects = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    createdProject,
    isCreateLoading,
    isCreateError
  } = useSelector((state: RootState) => state.projects);

  // Fetch projects once on mount
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  // Call this from your component when creating a project
  const handleCreateProject = (projectData: any) => {
    dispatch(createProjects(projectData));
  };
  

  return {
    projects,
    loading: projectsLoading,
    error: projectsError,
    createdProject,
    isCreateLoading,
    isCreateError,
    handleCreateProject // expose this
  };
};
