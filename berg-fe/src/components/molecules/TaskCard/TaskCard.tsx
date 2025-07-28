import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Grid,
  LinearProgress,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import ButtonComponent from '../../atoms/Button/Button';
import type { Task } from '../../../types/task';

interface TaskCardProps {
  task: Task;
  onStartTask?: (taskId: string) => void;
  onContinueTask?: (taskId: string) => void;
  onViewTask?: (taskId: string) => void;
  showActions?: boolean;
  showProjectInfo?: boolean;
  showAssigneeInfo?: boolean;
  variant?: 'default' | 'compact' | 'detailed' | 'admin';
  elevation?: number;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStartTask,
  onContinueTask,
  onViewTask,
  showActions = true,
  showProjectInfo = true,
  showAssigneeInfo = false,
  variant = 'default',
  elevation = 1
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: { 
        backgroundColor: '#fee2e2', 
        color: '#b91c1c',
        borderColor: '#fca5a5'
      },
      in_progress: { 
        backgroundColor: '#fef3c7', 
        color: '#92400e',
        borderColor: '#fcd34d'
      },
      completed: { 
        backgroundColor: '#d1fae5', 
        color: '#059669',
        borderColor: '#6ee7b7'
      },
      failed: { 
        backgroundColor: '#fecaca', 
        color: '#dc2626',
        borderColor: '#f87171'
      },
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTemplateTypeConfig = (templateType?: string) => {
    if (!templateType) return { color: '#6b7280', icon: '📋', label: 'Standard' };
    
    const configs = {
      'product_classification': { 
        color: '#e11d48', 
        icon: '🏷️', 
        label: 'Classification',
        description: 'Categorize and classify products'
      },
      'image_quality_check': { 
        color: '#f59e0b', 
        icon: '📸', 
        label: 'Quality Check',
        description: 'Verify image quality and standards'
      },
      'content_moderation': { 
        color: '#dc2626', 
        icon: '🛡️', 
        label: 'Moderation',
        description: 'Review content for compliance'
      },
      'data_verification': { 
        color: '#059669', 
        icon: '✅', 
        label: 'Verification',
        description: 'Validate data accuracy'
      },
      'custom': { 
        color: '#8b5cf6', 
        icon: '⚙️', 
        label: 'Custom',
        description: 'Custom annotation task'
      }
    };
    return configs[templateType as keyof typeof configs] || configs.custom;
  };

  const getTaskProgress = () => {
    if (task.status === 'completed') return 100;
    if (task.status === 'in_progress') {
      // Calculate based on time spent or other metrics
      return task.timeSpent ? Math.min((task.timeSpent / 30) * 100, 90) : 50;
    }
    return 0;
  };

  const canStart = task.status === 'pending';
  const canContinue = task.status === 'in_progress';
  const isCompleted = task.status === 'completed';
  const isFailed = task.status === 'failed';

  const taskProgress = getTaskProgress();
  const statusConfig = getStatusColor(task.status);
  const templateConfig = getTemplateTypeConfig(task.templateType);
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';
  const isAdmin = variant === 'admin';

  return (
    <Card 
      elevation={elevation}
      sx={{ 
        mb: isCompact ? 1 : 2,
        border: 1, 
        borderColor: isCompleted ? statusConfig.borderColor : 'grey.200',
        borderLeft: isCompleted ? 4 : 1,
        borderLeftColor: isCompleted ? statusConfig.color : 'transparent',
        '&:hover': {
          boxShadow: 4,
          borderColor: 'primary.main',
          transform: 'translateY(-1px)'
        },
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Priority/Flagged Indicator */}
      {task.annotationDecision?.flagged && (
        <Box 
          position="absolute" 
          top={-8} 
          right={16} 
          zIndex={1}
        >
          <Tooltip title="Flagged for review">
            <FlagIcon sx={{ color: 'error.main', fontSize: 20 }} />
          </Tooltip>
        </Box>
      )}

      <CardContent sx={{ p: isCompact ? 2 : 3 }}>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box flex={1}>
            {/* Task Title and Template Type */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography 
                variant={isCompact ? 'subtitle1' : 'h6'} 
                fontWeight="bold"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1 
                }}
              >
                <span>{templateConfig.icon}</span>
                {task.taskType}
              </Typography>
              
              <Chip
                label={templateConfig.label}
                size="small"
                sx={{ 
                  backgroundColor: templateConfig.color + '20',
                  color: templateConfig.color,
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            
            {/* Project and Batch Context */}
            {showProjectInfo && !isCompact && (
              <Box display="flex" alignItems="center" gap={2} mb={1} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <FolderIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {task.batch?.project?.projectName || 'Unknown Project'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📦 {task.batch?.batchName || 'Unknown Batch'}
                </Typography>
                
                {isAdmin && task.batch?.slaStatus && (
                  <>
                    <Typography variant="body2" color="text.secondary">•</Typography>
                    <Chip
                      label={task.batch.slaStatus.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                      color={
                        task.batch.slaStatus === 'on_track' ? 'success' :
                        task.batch.slaStatus === 'at_risk' ? 'warning' : 'error'
                      }
                    />
                  </>
                )}
              </Box>
            )}
            
            {/* Task Metadata */}
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                ID: {task.id.slice(0, 8)}...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📅 {new Date(task.createdAt).toLocaleDateString()}
              </Typography>
              
              {showAssigneeInfo && task.assignedUser && (
                <>
                  <Typography variant="body2" color="text.secondary">•</Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {task.assignedUser.split('@')[0]}
                    </Typography>
                  </Box>
                </>
              )}
              
              {task.timeSpent && isDetailed && (
                <>
                  <Typography variant="body2" color="text.secondary">•</Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <TimerIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {task.timeSpent}min
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
          
          {/* Status and Actions Section */}
          <Box textAlign="right">
            <Chip
              label={task.status.replace('_', ' ')}
              size="small"
              sx={{
                ...statusConfig,
                fontWeight: 600,
                mb: 1
              }}
            />
            
            {isCompleted && task.accuracy && (
              <Box display="flex" alignItems="center" gap={0.5} justifyContent="flex-end">
                <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  {task.accuracy}%
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Template Data Preview */}
        {!isCompact && task.templateData && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box mb={2}>
              <Typography variant="body2" fontWeight="bold" mb={1.5} color="text.primary">
                📋 Product Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={isDetailed ? 8 : 12}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Product:</strong> {task.templateData.productName || 'N/A'}
                    </Typography>
                    
                    {task.templateData.category && (
                      <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                        <CategoryIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Category:</strong> {task.templateData.category}
                        </Typography>
                      </Box>
                    )}
                    
                    {task.templateData.brand && (
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Brand:</strong> {task.templateData.brand}
                      </Typography>
                    )}
                    
                    {task.templateData.price && (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AttachMoneyIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Price:</strong> ${task.templateData.price}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                {isDetailed && (
                  <Grid item xs={12} md={4}>
                    <Box>
                      {task.templateData.productImages && task.templateData.productImages.length > 0 && (
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Badge badgeContent={task.templateData.productImages.length} color="primary">
                            <ImageIcon color="action" />
                          </Badge>
                          <Typography variant="body2">
                            Image{task.templateData.productImages.length > 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      )}
                      
                      {task.templateData.expectedLabels && task.templateData.expectedLabels.length > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Expected Labels:
                          </Typography>
                          <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
                            {task.templateData.expectedLabels.slice(0, 3).map((label, index) => (
                              <Chip 
                                key={index}
                                label={label} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                            {task.templateData.expectedLabels.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{task.templateData.expectedLabels.length - 3} more
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
              
              {task.templateData.annotationInstructions && isDetailed && (
                <Box 
                  mt={2} 
                  p={1.5} 
                  bgcolor="info.50" 
                  borderRadius={1}
                  border={1}
                  borderColor="info.200"
                >
                  <Box display="flex" alignItems="start" gap={1}>
                    <InfoOutlinedIcon fontSize="small" color="info" sx={{ mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="info.main" fontWeight="bold">
                        Instructions:
                      </Typography>
                      <Typography variant="body2" color="info.dark" sx={{ fontStyle: 'italic' }}>
                        {task.templateData.annotationInstructions}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Progress Indicator */}
        {(canContinue || isCompleted) && !isCompact && (
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                {isCompleted ? 'Completed' : 'Progress'}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                {taskProgress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={taskProgress}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: isCompleted ? statusConfig.color : 'primary.main'
                }
              }}
            />
          </Box>
        )}

        {/* Annotation Decision Preview */}
        {isCompleted && task.annotationDecision && isDetailed && (
          <Box 
            mt={2} 
            p={2} 
            bgcolor="success.50" 
            borderRadius={1}
            border={1}
            borderColor="success.200"
          >
            <Typography variant="body2" fontWeight="bold" color="success.dark" mb={1}>
              ✅ Annotation Decision
            </Typography>
            <Typography variant="body2" color="success.dark">
              <strong>Decision:</strong> {task.annotationDecision.decision}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              <Typography variant="body2" color="success.dark">
                <strong>Confidence:</strong> {task.annotationDecision.confidence}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(task.annotationDecision.timestamp).toLocaleString()}
              </Typography>
            </Box>
            {task.annotationDecision.notes && (
              <Typography variant="body2" color="success.dark" sx={{ fontStyle: 'italic', mt: 1 }}>
                "{task.annotationDecision.notes}"
              </Typography>
            )}
          </Box>
        )}

        {/* Action Buttons */}
        {showActions && (
          <Box 
            display="flex" 
            gap={2} 
            justifyContent="flex-end" 
            alignItems="center"
            mt={3}
          >
            {canStart && onStartTask && (
              <ButtonComponent
                buttonVariant="primary"
                onClick={() => onStartTask(task.id)}
                startIcon={<PlayArrowIcon />}
                sx={{ 
                  minWidth: isCompact ? 'auto' : undefined,
                  px: isCompact ? 2 : 3
                }}
              >
                {isCompact ? 'Start' : 'Start Task'}
              </ButtonComponent>
            )}
            
            {canContinue && onContinueTask && (
              <ButtonComponent
                buttonVariant="primary"
                onClick={() => onContinueTask(task.id)}
                startIcon={<PlayArrowIcon />}
                sx={{ 
                  minWidth: isCompact ? 'auto' : undefined,
                  px: isCompact ? 2 : 3
                }}
              >
                {isCompact ? 'Continue' : 'Continue Task'}
              </ButtonComponent>
            )}
            
            {(isCompleted || isFailed) && (
              <ButtonComponent
                buttonVariant="secondary"
                disabled={!onViewTask}
                onClick={() => onViewTask?.(task.id)}
                startIcon={<CheckCircleIcon />}
                sx={{ 
                  minWidth: isCompact ? 'auto' : undefined,
                  px: isCompact ? 2 : 3
                }}
              >
                {isCompact ? 'View' : isCompleted ? 'View Results' : 'View Details'}
              </ButtonComponent>
            )}
            
            {isAdmin && onViewTask && (
              <ButtonComponent
                buttonVariant="outlined"
                onClick={() => onViewTask(task.id)}
                sx={{ 
                  minWidth: isCompact ? 'auto' : undefined,
                  px: isCompact ? 1.5 : 2
                }}
              >
                View
              </ButtonComponent>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;