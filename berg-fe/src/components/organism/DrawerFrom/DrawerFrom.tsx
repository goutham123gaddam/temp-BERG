import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import type { ObjectSchema } from 'yup'
import {
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import InputComponent from '../../atoms/Input/Input'
import ButtonComponent from '../../atoms/Button/Button'
import type { FormData } from './type'
import { useSnackbar } from '../../../hooks/useSnackbar'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import BaseSwipeableDrawer from '../../atoms/BaseSwipeableDrawer/BaseSwipeableDrawer'
import { useProjects } from '../../../hooks/useProjects'

type DrawerFormProps = {
  open: boolean
  onClose: () => void
  onOpen: () => void
}

const formSchema: ObjectSchema<FormData> = object({
  Projectname: string().required('Project Name is required'),
  client: string().required('Client is required'),
})

const DrawerForm: React.FC<DrawerFormProps> = ({ open, onClose, onOpen }) => {
  const { success, error: showError } = useSnackbar()
  const { handleCreateProject } = useProjects() // ✅ call once

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
  })

  const [task, setTask] = useState('')

  const handleTaskChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTask(event.target.value as string)
  }

  const onSubmit = async (data: FormData) => {
    try {
      const newProject = {
        projectName: data.Projectname,
        owner: data.client,
        
      }

      console.log('Sending Project:', newProject)

      handleCreateProject(newProject)

      success('Project created successfully!')
      reset()
      setTask('')
      onClose()
    } catch (err) {
      showError('Something went wrong. Please try again.')
    }
  }

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
              Create New Project
            </Typography>
            <HighlightOffOutlinedIcon sx={{ cursor: 'pointer' }} onClick={onClose} />
          </Box>

          <Box>
            <Typography variant="subtitle1">Project Name</Typography>
            <InputComponent
              placeholder="Project Name..."
              type="text"
              {...register('Projectname')}
              error={!!errors.Projectname}
              helperText={errors.Projectname?.message}
              sx={{ width: '100%', borderRadius: '10px' }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1">Client Name</Typography>
            <InputComponent
              placeholder="Enter client name..."
              type="text"
              {...register('client')}
              error={!!errors.client}
              helperText={errors.client?.message}
              sx={{ width: '100%', borderRadius: '10px' }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1">Task</Typography>
            <FormControl fullWidth>
              <InputLabel id="task-label">Select Task</InputLabel>
              <Select
                labelId="task-label"
                value={task}
                onChange={()=>handleTaskChange}
                label="Select Task"
              >
                <MenuItem value="Annotation">Annotation</MenuItem>
                <MenuItem value="Review">Review</MenuItem>
                <MenuItem value="Validation">Validation</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" justifyContent="end" mt={3} gap={2}>
            <ButtonComponent buttonVariant="secondary" onClick={onClose}>
              Cancel
            </ButtonComponent>
            <ButtonComponent buttonVariant="primary" type="submit">
              Create Project
            </ButtonComponent>
          </Box>
        </Box>
      </Box>
    </BaseSwipeableDrawer>
  )
}

export default DrawerForm
