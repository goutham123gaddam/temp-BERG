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

export default function CreateTaskDrawer({ batch, onClose, existingTask }: CreateTaskDrawerProps) {
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
    }
  }, [existingTask]);

  const handleSubmit = async () => {
    if (!taskType.trim() || !assignedUser.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    const taskPayload = {
      batchId: batch.id,
      taskType: taskType.trim(),
      assignedUser: assignedUser.trim(),
      status,
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

  // Input management
  const addInput = () => {
    setInputs([...inputs, { text: '' }]);
  };

  const removeInput = (index: number) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const updateInput = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { text: value };
    setInputs(newInputs);
  };

  // Output management
  const addOutput = () => {
    setOutputs([...outputs, { question: '', answerType: 'dropdown', options: [''] }]);
  };

  const removeOutput = (index: number) => {
    if (outputs.length > 1) {
      setOutputs(outputs.filter((_, i) => i !== index));
    }
  };

  const updateOutput = (index: number, field: keyof TaskOutput, value: any) => {
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
      open={true}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 600,
          padding: 0
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              {existingTask ? 'Edit Task' : 'Create New Task'}
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

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="annotation_inprogress">Annotation In Progress</MenuItem>
                <MenuItem value="annotation_inreview">Annotation In Review</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Inputs Section */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Task Inputs
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={addInput}
                variant="outlined"
              >
                Add Input
              </Button>
            </Box>

            {inputs.map((input, index) => (
              <Box key={index} mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    fullWidth
                    label={`Input ${index + 1}`}
                    value={input.text}
                    onChange={(e) => updateInput(index, e.target.value)}
                    multiline
                    rows={2}
                    placeholder="Enter the input text or data for this task"
                  />
                  {inputs.length > 1 && (
                    <IconButton
                      onClick={() => removeInput(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Outputs Section */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Expected Outputs
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={addOutput}
                variant="outlined"
              >
                Add Output
              </Button>
            </Box>

            {outputs.map((output, outputIndex) => (
              <Box key={outputIndex} mb={3} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Output {outputIndex + 1}
                  </Typography>
                  {outputs.length > 1 && (
                    <IconButton
                      onClick={() => removeOutput(outputIndex)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <TextField
                  fullWidth
                  label="Question"
                  value={output.question}
                  onChange={(e) => updateOutput(outputIndex, 'question', e.target.value)}
                  margin="normal"
                  placeholder="What question should this output answer?"
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Answer Type</InputLabel>
                  <Select
                    value={output.answerType}
                    label="Answer Type"
                    onChange={(e) => updateOutput(outputIndex, 'answerType', e.target.value)}
                  >
                    <MenuItem value="dropdown">Dropdown</MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                  </Select>
                </FormControl>

                {(output.answerType === 'dropdown' || output.answerType === 'boolean') && (
                  <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight="bold">
                        Options
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addOption(outputIndex)}
                        variant="text"
                      >
                        Add Option
                      </Button>
                    </Box>

                    {output.options.map((option, optionIndex) => (
                      <Box key={optionIndex} display="flex" alignItems="center" gap={1} mb={1}>
                        <TextField
                          fullWidth
                          size="small"
                          label={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(outputIndex, optionIndex, e.target.value)}
                          placeholder="Enter option value"
                        />
                        {output.options.length > 1 && (
                          <IconButton
                            onClick={() => removeOption(outputIndex, optionIndex)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              disabled={isLoading}
            >
              {isLoading 
                ? (existingTask ? 'Updating...' : 'Creating...') 
                : (existingTask ? 'Update Task' : 'Create Task')
              }
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}