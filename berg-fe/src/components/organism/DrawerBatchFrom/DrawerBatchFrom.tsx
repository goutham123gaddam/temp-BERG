import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, mixed } from 'yup';
import {
  Typography
} from '@mui/material';
import InputComponent from '../../atoms/Input/Input';
import ButtonComponent from '../../atoms/Button/Button';
import { useSnackbar } from '../../../hooks/useSnackbar';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import BaseSwipeableDrawer from '../../atoms/BaseSwipeableDrawer/BaseSwipeableDrawer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useBatches } from '../../../hooks/useBatch';
import { addBatch } from '../../../features/batch/batchSlice';

type DrawerFormProps = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  projectId: string;
};

type FormData = {
  batchName: string;
  dueDate: any;
};

const formSchema = object({
  batchName: string().required('Batch Name is required'),
  dueDate: mixed().required('Due Date is required'),
});

const DrawerBatchForm: React.FC<DrawerFormProps> = ({ open, onClose, onOpen, projectId }) => {
  const { success, error: showError } = useSnackbar();
  const { addNewBatch, fetchBatches } = useBatches();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      batchName: '',
      dueDate: null,
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        projectId,
        batchName: data.batchName,
        dueDate: data.dueDate?.toISOString(),
      };
    console.log("----->",payload);
      const result = await addNewBatch(payload);

      if (addBatch.fulfilled.match(result)) {
        success('Batch created successfully!');
        fetchBatches(projectId); // Refresh batches
        reset();
        onClose();
      } else {
        showError(result.payload as string || 'Failed to create batch');
      }
    } catch (err) {
      showError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseSwipeableDrawer anchor="right" open={open} onClose={onClose} onOpen={onOpen}>
      <Box sx={{ minWidth: 550 }} p={2}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Create New Batch
            </Typography>
            <HighlightOffOutlinedIcon sx={{ cursor: 'pointer' }} onClick={onClose} />
          </Box>

          <Box>
            <Typography variant="subtitle1">Batch Name</Typography>
            <InputComponent
              placeholder="Enter batch name..."
              type="text"
              {...register('batchName')}
              error={!!errors.batchName}
              helperText={errors.batchName?.message}
              sx={{ width: '100%', borderRadius: '10px' }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1">Due Date</Typography>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Select due date"
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dueDate,
                      helperText: errors.dueDate?.message as string,
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box display="flex" justifyContent="end" mt={3} gap={2}>
            <ButtonComponent buttonVariant="secondary" onClick={onClose}>
              Cancel
            </ButtonComponent>
            <ButtonComponent buttonVariant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Batch'}
            </ButtonComponent>
          </Box>
        </Box>
      </Box>
    </BaseSwipeableDrawer>
  );
};

export default DrawerBatchForm;
