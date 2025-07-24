import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { createTask, updateTask } from '../../../features/task/taskSlice';
import { useSnackbar } from '../../../hooks/useSnackbar';
import type { RootState, AppDispatch } from '../../../app/store';

interface CreateTaskDrawerProps {
  batch: any;
  open: boolean;
  onClose: () => void;
  existingTask?: any;
}

interface TaskInput {
  text: string;
}

interface TaskOutput {
  question: string;
  answerType: 'dropdown' | 'text' | 'number' | 'boolean';
  options: string[];
}

export default function CreateTaskDrawer({ batch, open, onClose, existingTask }: CreateTaskDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isCreateLoading, isUpdateLoading } = useSelector((state: RootState) => state.tasks);
  const { success, error: showError } = useSnackbar();

  const [taskType, setTaskType] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [status, setStatus] = useState('pending');
  const [inputs, setInputs] = useState<TaskInput[]>([{ text: '' }]);
  const [outputs, setOutputs] = useState<TaskOutput[]>([
    { question: '', answerType: 'dropdown', options: [''] }
  ]);

  const isLoading = isCreateLoading || isUpdateLoading;
  const isEditMode = !!existingTask;

  useEffect(() => {
    if (existingTask) {
      setTaskType(existingTask.taskType || '');
      setAssignedUser(existingTask.assignedUser || '');
      setStatus(existingTask.status || 'pending');
      setInputs(existingTask.inputs || [{ text: '' }]);
      setOutputs(
        existingTask.outputs || [
          { question: '', answerType: 'dropdown', options: [''] }
        ]
      );
    } else {
      // Reset form for new task
      setTaskType('');
      setAssignedUser('');
      setStatus('pending'); // Always start new tasks as pending
      setInputs([{ text: '' }]);
      setOutputs([{ question: '', answerType: 'dropdown', options: [''] }]);
    }
  }, [existingTask, open]);

  const handleSubmit = async () => {
    if (!taskType.trim() || !assignedUser.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    const taskPayload = {
      batchId: batch.id,
      taskType: taskType.trim(),
      assignedUser: assignedUser.trim(),
      status: isEditMode ? status : 'pending', // Force pending for new tasks
      inputs: inputs.filter(input => input.text.trim() !== ''),
      outputs: outputs.filter(output => 
        output.question.trim() !== '' && 
        output.options.some(opt => opt.trim() !== '')
      )
    };

    try {
      if (existingTask?.id) {
        await dispatch(updateTask({ id: existingTask.id, data: taskPayload })).unwrap();
        success('Task updated successfully!');
      } else {
        await dispatch(createTask(taskPayload)).unwrap();
        success('Task created successfully!');
      }
      onClose();
    } catch (error) {
      showError('Failed to save task. Please try again.');
    }
  };

  const addInput = () => {
    setInputs([...inputs, { text: '' }]);
  };

  const removeInput = (index: number) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const updateInput = (index: number, text: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { text };
    setInputs(newInputs);
  };

  const addOutput = () => {
    setOutputs([...outputs, { question: '', answerType: 'dropdown', options: [''] }]);
  };

  const removeOutput = (index: number) => {
    if (outputs.length > 1) {
      setOutputs(outputs.filter((_, i) => i !== index));
    }
  };

  const updateOutput = (index: number, field: string, value: any) => {
    const newOutputs = [...outputs];
    newOutputs[index] = { ...newOutputs[index], [field]: value };
    setOutputs(newOutputs);
  };

  const addOption = (outputIndex: number) => {
    const newOutputs = [...outputs];
    newOutputs[outputIndex].options.push('');
    setOutputs(newOutputs);
  };

  const removeOption = (outputIndex: number, optionIndex: number) => {
    const newOutputs = [...outputs];
    if (newOutputs[outputIndex].options.length > 1) {
      newOutputs[outputIndex].options.splice(optionIndex, 1);
      setOutputs(newOutputs);
    }
  };

  const updateOption = (outputIndex: number, optionIndex: number, value: string) => {
    const newOutputs = [...outputs];
    newOutputs[outputIndex].options[optionIndex] = value;
    setOutputs(newOutputs);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '600px',
          maxWidth: '90vw'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Batch: {batch?.batchName}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {/* Basic Information */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Basic Information
            </Typography>
            
            <TextField
              fullWidth
              label="Task Type *"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              margin="normal"
              placeholder="e.g., Image Annotation, Text Classification"
            />
            
            <TextField
              fullWidth
              label="Assigned User *"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              margin="normal"
              placeholder="e.g., user@example.com"
            />

            {/* Only show status selector for existing tasks */}
            {isEditMode && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Show current status for new tasks */}
            {!isEditMode && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Status: New tasks will be created as "Pending"
                </Typography>
                <Chip 
                  label="Pending" 
                  size="small"
                  sx={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#b91c1c',
                    fontWeight: 600 
                  }} 
                />
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Task Inputs */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Task Inputs
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addInput}
                size="small"
                variant="outlined"
              >
                Add Input
              </Button>
            </Box>
            
            {inputs.map((input, index) => (
              <Box key={index} display="flex" gap={1} mb={1}>
                <TextField
                  fullWidth
                  label={`Input ${index + 1}`}
                  value={input.text}
                  onChange={(e) => updateInput(index, e.target.value)}
                  placeholder="Enter input text or description"
                />
                <IconButton
                  onClick={() => removeInput(index)}
                  disabled={inputs.length === 1}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Task Outputs */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Expected Outputs
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addOutput}
                size="small"
                variant="outlined"
              >
                Add Output
              </Button>
            </Box>
            
            {outputs.map((output, outputIndex) => (
              <Box key={outputIndex} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                  <Typography variant="body2" fontWeight="bold">
                    Output {outputIndex + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeOutput(outputIndex)}
                    disabled={outputs.length === 1}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <TextField
                  fullWidth
                  label="Question/Label"
                  value={output.question}
                  onChange={(e) => updateOutput(outputIndex, 'question', e.target.value)}
                  margin="normal"
                  size="small"
                />
                
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Answer Type</InputLabel>
                  <Select
                    value={output.answerType}
                    label="Answer Type"
                    onChange={(e) => updateOutput(outputIndex, 'answerType', e.target.value)}
                  >
                    <MenuItem value="dropdown">Dropdown</MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Yes/No</MenuItem>
                  </Select>
                </FormControl>

                {(output.answerType === 'dropdown' || output.answerType === 'boolean') && (
                  <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">Options</Typography>
                      {output.answerType === 'dropdown' && (
                        <Button
                          size="small"
                          onClick={() => addOption(outputIndex)}
                          startIcon={<AddIcon />}
                        >
                          Add Option
                        </Button>
                      )}
                    </Box>
                    
                    {output.answerType === 'boolean' ? (
                      <Box>
                        <Chip label="Yes" sx={{ mr: 1 }} />
                        <Chip label="No" />
                      </Box>
                    ) : (
                      output.options.map((option, optionIndex) => (
                        <Box key={optionIndex} display="flex" gap={1} mb={1}>
                          <TextField
                            fullWidth
                            label={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => updateOption(outputIndex, optionIndex, e.target.value)}
                            size="small"
                          />
                          <IconButton
                            onClick={() => removeOption(outputIndex, optionIndex)}
                            disabled={output.options.length === 1}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}