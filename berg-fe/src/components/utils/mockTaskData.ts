import type { Task } from '../../types/task';

export const mockAnnotatorTasks: Task[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    taskType: 'Product Classification',
    assignedUser: 'annotator1@bergflow.com',
    status: 'pending',
    templateType: 'product_classification',
    templateData: {
      productName: 'Samsung Galaxy S24 Ultra',
      productImages: [
        'https://images.samsung.com/us/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-camera.jpg',
        'https://images.samsung.com/us/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-display.jpg'
      ],
      productDescription: 'Premium smartphone with advanced camera system and S Pen',
      category: 'Electronics',
      brand: 'Samsung',
      price: 1299.99,
      annotationInstructions: 'Classify this product into the correct category and verify all product details',
      expectedLabels: ['Electronics', 'Smartphones', 'Premium'],
      qualityChecks: ['Brand verification', 'Price accuracy', 'Image quality']
    },
    batchId: 'batch-001',
    batch: {
      id: 'batch-001',
      batchName: 'Electronics Q1 2024',
      dueDate: '2024-03-15T00:00:00Z',
      slaStatus: 'on_track',
      projectId: 'project-001',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      project: {
        id: 'project-001',
        projectName: 'Product Catalog Classification'
      }
    },
    inputs: [],
    outputs: [],
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    taskType: 'Image Quality Check',
    assignedUser: 'annotator1@bergflow.com',
    status: 'in_progress',
    templateType: 'image_quality_check',
    templateData: {
      productName: 'Nike Air Max 270',
      productImages: [
        'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/i1-665455a5-45de-40fb-945f-c1852b82400d/air-max-270-mens-shoes.png'
      ],
      productDescription: 'Lifestyle running shoes with air cushioning',
      category: 'Footwear',
      brand: 'Nike',
      price: 150.00,
      annotationInstructions: 'Check image quality, lighting, and product visibility',
      qualityChecks: ['Image resolution', 'Lighting quality', 'Product visibility', 'Background cleanliness']
    },
    batchId: 'batch-002',
    batch: {
      id: 'batch-002',
      batchName: 'Footwear Images Q1',
      dueDate: '2024-02-28T00:00:00Z',
      slaStatus: 'on_track',
      projectId: 'project-002',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
      project: {
        id: 'project-002',
        projectName: 'Product Image Quality Assurance'
      }
    },
    inputs: [],
    outputs: [],
    timeSpent: 25,
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-25T16:45:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    taskType: 'Content Moderation',
    assignedUser: 'annotator1@bergflow.com',
    status: 'completed',
    accuracy: 95,
    templateType: 'content_moderation',
    templateData: {
      productName: 'Organic Green Tea',
      productImages: [
        'https://example.com/green-tea-1.jpg'
      ],
      productDescription: 'Premium organic green tea leaves, 100% natural',
      category: 'Food & Beverages',
      brand: 'TeaLand',
      price: 24.99,
      annotationInstructions: 'Review product content for compliance and accuracy'
    },
    annotationDecision: {
      decision: 'approved',
      confidence: 95,
      labels: ['Organic', 'Natural', 'Beverage'],
      notes: 'Product meets all quality standards. Description is accurate.',
      qualityScore: 95,
      flagged: false,
      timestamp: '2024-01-22T11:30:00Z',
      annotatorId: 'annotator1@bergflow.com',
      timeSpent: 15
    },
    batchId: 'batch-003',
    batch: {
      id: 'batch-003',
      batchName: 'Food Products Review',
      dueDate: '2024-02-15T00:00:00Z',
      slaStatus: 'on_track',
      projectId: 'project-003',
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-05T10:00:00Z',
      project: {
        id: 'project-003',
        projectName: 'Food & Beverage Content Review'
      }
    },
    inputs: [],
    outputs: [],
    timeSpent: 15,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
    completedAt: '2024-01-22T11:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    taskType: 'Data Verification',
    assignedUser: 'annotator1@bergflow.com',
    status: 'pending',
    templateType: 'data_verification',
    templateData: {
      productName: 'MacBook Pro 14-inch',
      productImages: [
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202110?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1632788574000'
      ],
      productDescription: 'Professional laptop with M3 Pro chip',
      category: 'Computers',
      brand: 'Apple',
      price: 1999.00,
      metadata: {
        specs: {
          processor: 'Apple M3 Pro',
          memory: '18GB',
          storage: '512GB SSD',
          display: '14.2-inch Liquid Retina XDR'
        }
      },
      annotationInstructions: 'Verify all technical specifications and pricing information'
    },
    batchId: 'batch-004',
    batch: {
      id: 'batch-004',
      batchName: 'Tech Specs Verification',
      dueDate: '2024-03-01T00:00:00Z',
      slaStatus: 'on_track',
      projectId: 'project-004',
      createdAt: '2024-01-25T10:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z',
      project: {
        id: 'project-004',
        projectName: 'Technical Product Verification'
      }
    },
    inputs: [],
    outputs: [],
    createdAt: '2024-01-25T16:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    taskType: 'Product Classification',
    assignedUser: 'annotator1@bergflow.com',
    status: 'completed',
    accuracy: 88,
    templateType: 'product_classification',
    templateData: {
      productName: 'Yoga Mat Premium',
      productImages: [
        'https://example.com/yoga-mat-1.jpg'
      ],
      productDescription: 'Non-slip yoga mat for all skill levels',
      category: 'Sports & Fitness',
      brand: 'ZenFit',
      price: 45.99
    },
    annotationDecision: {
      decision: 'Sports & Fitness - Yoga Equipment',
      confidence: 88,
      labels: ['Sports', 'Fitness', 'Yoga', 'Equipment'],
      notes: 'Correctly categorized as fitness equipment',
      qualityScore: 88,
      flagged: false,
      timestamp: '2024-01-20T14:20:00Z',
      annotatorId: 'annotator1@bergflow.com',
      timeSpent: 8
    },
    batchId: 'batch-001',
    batch: {
      id: 'batch-001',
      batchName: 'Electronics Q1 2024',
      dueDate: '2024-03-15T00:00:00Z',
      slaStatus: 'on_track',
      projectId: 'project-001',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      project: {
        id: 'project-001',
        projectName: 'Product Catalog Classification'
      }
    },
    inputs: [],
    outputs: [],
    timeSpent: 8,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
    completedAt: '2024-01-20T14:20:00Z'
  }
];

/**
 * Helper function to simulate API delay
 */
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock function to get annotator tasks (simulates fetchMyTasks)
 */
export const getMockAnnotatorTasks = async (): Promise<Task[]> => {
  await simulateApiDelay(800);
  return mockAnnotatorTasks;
};

/**
 * Mock function to get task statistics
 */
export const getMockTaskStatistics = () => {
  const tasks = mockAnnotatorTasks;
  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    todaysTasks: tasks.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.createdAt).toDateString() === today;
    }).length,
    averageAccuracy: Math.round(
      tasks.filter(t => t.accuracy).reduce((acc, t) => acc + (t.accuracy || 0), 0) / 
      tasks.filter(t => t.accuracy).length
    ) || 0
  };
};