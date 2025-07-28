export interface Task {
  id: string;
  taskType: string;
  assignedUser: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed'; // CORRECTED: Only these 4 statuses exist
  accuracy?: number;
  timeSpent?: number;
  
  // NEW FIELDS for annotation workflow:
  templateType?: string; // Type of annotation template
  templateData?: TemplateData; // Product data that needs annotation
  annotationDecision?: AnnotationDecision; // Final annotation decision (nullable until completed)
  
  // LEGACY FIELDS (keeping for backward compatibility):
  inputs?: any[]; // Legacy field - will be deprecated
  outputs?: any[]; // Legacy field - will be deprecated
  
  batchId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Relations
  batch?: Batch;
}

export interface CreateTaskPayload {
  batchId: string;
  taskType: string;
  assignedUser: string;
  status?: string;
  templateType?: string;
  templateData?: TemplateData;
  // Legacy support:
  inputs?: any[];
  outputs?: any[];
}

export interface UpdateTaskPayload {
  taskType?: string;
  assignedUser?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  accuracy?: number;
  timeSpent?: number;
  templateType?: string;
  templateData?: TemplateData;
  annotationDecision?: AnnotationDecision;
  completedAt?: string;
  // Legacy support:
  inputs?: any[];
  outputs?: any[];
}

// Template Data Structure (what admin provides when creating tasks)
export interface TemplateData {
  productName: string;
  productImages: string[]; // Array of image URLs
  productDescription?: string;
  category?: string;
  brand?: string;
  price?: number;
  metadata?: Record<string, any>; // Additional flexible data
  
  // Specific to annotation requirements:
  annotationInstructions?: string;
  expectedLabels?: string[]; // Possible classification options
  qualityChecks?: string[]; // Things to verify
}

// Annotation Decision Structure (what annotator provides)
export interface AnnotationDecision {
  // Core decision:
  decision: string; // Main annotation result (e.g., "category: electronics", "quality: good")
  confidence: number; // 0-100 confidence level
  
  // Additional details:
  labels?: string[]; // Multiple labels if applicable
  notes?: string; // Optional notes from annotator
  qualityScore?: number; // Quality rating
  flagged?: boolean; // If task needs review
  
  // Metadata:
  timestamp: string;
  annotatorId: string;
  timeSpent?: number; // Time spent on annotation in minutes
  
  // Flexible structure for different annotation types:
  customFields?: Record<string, any>;
}

// Template Types (predefined annotation workflows)
export type TemplateType = 
  | 'product_classification' 
  | 'image_quality_check'
  | 'content_moderation'
  | 'data_verification'
  | 'custom';

// Batch interface for reference
export interface Batch {
  id: string;
  batchName: string;
  dueDate: string;
  slaStatus: 'on_track' | 'at_risk' | 'overdue';
  projectId: string;
  createdAt: string;
  updatedAt: string;
  // Stats:
  totalTasks?: number;
  completedTasks?: number;
  pendingTasks?: number;
}

// Task filters for the new Tasks page
export interface TaskFilters {
  status?: string[];
  templateType?: string[];
  assignedUser?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}