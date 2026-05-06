import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Delete, Edit, Refresh, TaskAlt } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { useAlert, useAxios } from '../../hooks';
import type { Task } from '../../models';
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from '../../lib/tasksApi';

type EditingTask = Pick<Task, 'id' | 'text'> | null;

export const TaskPage = () => {
  const axios = useAxios();
  const { showAlert } = useAlert();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState<EditingTask>(null);
  const [editText, setEditText] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks(axios);
      setTasks(data);
    } catch {
      showAlert('No fue posible cargar las tareas', 'error');
    } finally {
      setLoading(false);
    }
  }, [axios, showAlert]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async () => {
    const text = newTaskText.trim();
    if (!text) {
      showAlert('Debes ingresar una tarea', 'warning');
      return;
    }

    setSaving(true);
    try {
      const createdTask = await createTask(axios, { text });
      setTasks((prev) => [createdTask, ...prev]);
      setNewTaskText('');
      showAlert('Tarea creada correctamente', 'success');
    } catch {
      showAlert('No fue posible crear la tarea', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setSaving(true);
    try {
      await deleteTask(axios, id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      showAlert('Tarea eliminada', 'success');
    } catch {
      showAlert('No fue posible eliminar la tarea', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    setSaving(true);
    try {
      const updatedTask = await toggleTaskStatus(axios, task);
      setTasks((prev) =>
        prev.map((current) => (current.id === updatedTask.id ? updatedTask : current)),
      );
      showAlert('Estado actualizado', 'success');
    } catch {
      showAlert('No fue posible cambiar el estado', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask({ id: task.id, text: task.text });
    setEditText(task.text);
  };

  const closeEditDialog = () => {
    setEditingTask(null);
    setEditText('');
  };

  const handleUpdateTask = async () => {
    const text = editText.trim();
    if (!editingTask?.id) return;
    if (!text) {
      showAlert('El texto de la tarea no puede estar vacío', 'warning');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateTask(axios, editingTask.id, { text });
      setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
      closeEditDialog();
      showAlert('Tarea actualizada', 'success');
    } catch {
      showAlert('No fue posible editar la tarea', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Gestión de Tareas</Typography>

      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Nueva tarea"
            value={newTaskText}
            onChange={(event) => setNewTaskText(event.target.value)}
            fullWidth
            disabled={saving}
          />
          <Button
            variant="contained"
            onClick={handleCreateTask}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <TaskAlt />}
          >
            Crear
          </Button>
          <Button
            variant="outlined"
            onClick={() => void loadTasks()}
            disabled={loading || saving}
            startIcon={<Refresh />}
          >
            Recargar
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Alert severity="info">No hay tareas registradas.</Alert>
      ) : (
        <Stack spacing={1.5}>
          {tasks.map((task) => (
            <Paper
              key={task.id}
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: task.status === 'Finalizada' ? '6px solid #2e7d32' : '6px solid #ed6c02',
                opacity: task.status === 'Finalizada' ? 0.85 : 1,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    textDecoration: task.status === 'Finalizada' ? 'line-through' : 'none',
                    fontWeight: 500,
                  }}
                >
                  {task.text}
                </Typography>
                <Chip
                  label={task.status}
                  size="small"
                  color={task.status === 'Finalizada' ? 'success' : 'warning'}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  color={task.status === 'Finalizada' ? 'warning' : 'success'}
                  onClick={() => void handleToggleTask(task)}
                  disabled={saving}
                >
                  {task.status === 'Finalizada' ? 'Marcar pendiente' : 'Finalizar'}
                </Button>
                <IconButton
                  color="primary"
                  onClick={() => openEditDialog(task)}
                  disabled={saving}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => void handleDeleteTask(task.id)}
                  disabled={saving}
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={Boolean(editingTask)} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar tarea</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Texto de la tarea"
            fullWidth
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            disabled={saving}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={() => void handleUpdateTask()} variant="contained" disabled={saving}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};