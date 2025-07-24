import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, createProjects, deleteProject, clearErrors } from '../features/project/projectSlice';
import type { RootState, AppDispatch } from '../app/store';

export const useProjects = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    createdProject,
    isCreateLoading,
    isCreateError,
    isDeleteLoading,
    isDeleteError
  } = useSelector((state: RootState) => state.projects);


  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  // Calculate project statistics (backend now provides most of this data)
  const projectStats = useMemo(() => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.progress === 100).length;
    const activeProjects = totalProjects - completedProjects;
    
    // Use backend-calculated totals
    const totalTasks = projects.reduce((sum, project) => {
      return sum + (project.totalTasks || 0);
    }, 0);
    
    const completedTasks = projects.reduce((sum, project) => {
      return sum + (project.completedTasks || 0);
    }, 0);
    
    // Calculate average accuracy from backend data
    const projectsWithAccuracy = projects.filter(p => p.accuracy != null && p.accuracy > 0);
    const averageAccuracy = projectsWithAccuracy.length > 0 
      ? projectsWithAccuracy.reduce((sum, p) => sum + (p.accuracy || 0), 0) / projectsWithAccuracy.length
      : 0;

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      averageAccuracy: Math.round(averageAccuracy * 10) / 10 // Round to 1 decimal
    };
  }, [projects]);

  // Create project handler
  const handleCreateProject = (projectData: any) => {
    dispatch(createProjects(projectData));
  };

  // Delete project handler
  const handleDeleteProject = async (projectId: string) => {
    try {
      await dispatch(deleteProject(projectId)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Clear errors handler
  const handleClearErrors = () => {
    dispatch(clearErrors());
  };

  return {
    projects,
    loading: projectsLoading,
    error: projectsError,
    createdProject,
    isCreateLoading,
    isCreateError,
    isDeleteLoading,
    isDeleteError,
    projectStats,
    handleCreateProject,
    handleDeleteProject,
    handleClearErrors
  };
};