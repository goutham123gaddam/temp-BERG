// src/hooks/useDynamicFilters.ts
import { useMemo } from 'react';
import type { GroupedOption } from '../components/type/projectType';

interface Project {
  id: string;
  projectName: string;
  owner: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  batches?: any[];
  // Add other project fields as needed
}

export const useDynamicFilters = (projects: Project[]) => {
  
  // Generate dynamic filter options based on actual data
  const dynamicFilterOptions = useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        statusOptions: [],
        projectNameOptions: [],
        ownerOptions: [],
        progressOptions: [],
        priorityOptions: []
      };
    }

    // Extract unique project names
    const uniqueProjectNames = [...new Set(
      projects
        .map(p => p.projectName)
        .filter(name => name && name.trim() !== '')
    )].sort();

    // Extract unique owners
    const uniqueOwners = [...new Set(
      projects
        .map(p => p.owner)
        .filter(owner => owner && owner.trim() !== '')
    )].sort();

    // Generate status options based on progress
    const statusOptions = ['Active', 'Completed'];
    
    // Generate progress ranges
    const progressOptions = ['0-25%', '26-50%', '51-75%', '76-99%', '100%'];

    // Extract unique priorities if available
    const uniquePriorities = [...new Set(
      projects
        .map(p => (p as any).priority)
        .filter(priority => priority && priority.trim() !== '')
    )].sort();

    return {
      statusOptions,
      projectNameOptions: uniqueProjectNames,
      ownerOptions: uniqueOwners,
      progressOptions,
      priorityOptions: uniquePriorities.length > 0 ? uniquePriorities : ['High', 'Medium', 'Low']
    };
  }, [projects]);

  // Generate filter configurations
  const projectFilterOptions: GroupedOption[] = useMemo(() => [
    {
      group: 'STATUS',
      type: 'checkbox',
      options: dynamicFilterOptions.statusOptions
    },
    {
      group: 'PROJECT NAME',
      type: 'checkbox',
      options: dynamicFilterOptions.projectNameOptions
    },
    {
      group: 'OWNER',
      type: 'checkbox',
      options: dynamicFilterOptions.ownerOptions
    },
    {
      group: 'PROGRESS',
      type: 'checkbox',
      options: dynamicFilterOptions.progressOptions
    },
    ...(dynamicFilterOptions.priorityOptions.length > 0 ? [{
      group: 'PRIORITY',
      type: 'checkbox' as const,
      options: dynamicFilterOptions.priorityOptions
    }] : [])
  ], [dynamicFilterOptions]);

  // Date filter options (static but can be dynamic based on project creation dates)
  const dateFilterOptions: GroupedOption[] = useMemo(() => {
    const today = new Date();
    const oldestProject = projects.reduce((oldest, project) => {
      const projectDate = new Date(project.createdAt);
      return projectDate < oldest ? projectDate : oldest;
    }, today);

    const daysDiff = Math.ceil((today.getTime() - oldestProject.getTime()) / (1000 * 60 * 60 * 24));
    
    const options = ['Today', 'This week', 'This month'];
    
    if (daysDiff > 90) options.push('Last 3 months');
    if (daysDiff > 180) options.push('Last 6 months');
    if (daysDiff > 365) options.push('This year', 'Last year');
    
    options.push('Custom');

    return [{
      group: 'DATE',
      type: 'radio',
      options
    }];
  }, [projects]);

  // Advanced filter function
  const applyFilters = (
    projects: Project[],
    searchQuery: string,
    selectedFilters: {
      status: string[];
      projectName: string[];
      owner: string[];
      progress: string[];
      priority: string[];
      date: string;
    }
  ) => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.projectName?.toLowerCase().includes(query) ||
        project.owner?.toLowerCase().includes(query) ||
        (project as any).description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (selectedFilters.status.length > 0) {
      filtered = filtered.filter(project => {
        const status = (project.progress || 0) === 100 ? 'Completed' : 'Active';
        return selectedFilters.status.includes(status);
      });
    }

    // Project name filter
    if (selectedFilters.projectName.length > 0) {
      filtered = filtered.filter(project => 
        selectedFilters.projectName.includes(project.projectName)
      );
    }

    // Owner filter
    if (selectedFilters.owner.length > 0) {
      filtered = filtered.filter(project => 
        selectedFilters.owner.includes(project.owner)
      );
    }

    // Progress filter
    if (selectedFilters.progress.length > 0) {
      filtered = filtered.filter(project => {
        const progress = project.progress || 0;
        return selectedFilters.progress.some(range => {
          switch (range) {
            case '0-25%': return progress >= 0 && progress <= 25;
            case '26-50%': return progress >= 26 && progress <= 50;
            case '51-75%': return progress >= 51 && progress <= 75;
            case '76-99%': return progress >= 76 && progress <= 99;
            case '100%': return progress === 100;
            default: return false;
          }
        });
      });
    }

    // Priority filter
    if (selectedFilters.priority.length > 0) {
      filtered = filtered.filter(project => 
        selectedFilters.priority.includes((project as any).priority)
      );
    }

    // Date filter
    if (selectedFilters.date) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedFilters.date) {
        case 'Today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'This week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'This month':
          filterDate.setDate(now.getDate() - 30);
          break;
        case 'Last 3 months':
          filterDate.setDate(now.getDate() - 90);
          break;
        case 'Last 6 months':
          filterDate.setDate(now.getDate() - 180);
          break;
        case 'This year':
          filterDate.setMonth(0, 1);
          filterDate.setHours(0, 0, 0, 0);
          break;
        default:
          return filtered; // No date filtering for other options
      }
      
      filtered = filtered.filter(project => {
        const projectDate = new Date(project.createdAt);
        return projectDate >= filterDate;
      });
    }

    return filtered;
  };

  // Get filter summary for display
  const getFilterSummary = (selectedFilters: any) => {
    const activeFilters = [];
    
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        activeFilters.push(`${key}: ${value.length} selected`);
      } else if (typeof value === 'string' && value.trim() !== '') {
        activeFilters.push(`${key}: ${value}`);
      }
    });

    return activeFilters;
  };

  return {
    projectFilterOptions,
    dateFilterOptions,
    dynamicFilterOptions,
    applyFilters,
    getFilterSummary
  };
};