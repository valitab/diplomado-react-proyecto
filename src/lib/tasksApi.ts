import type { AxiosInstance } from 'axios';
import {
    normalizeTask,
    type Task,
    type TaskCreatePayload,
    type TaskUpdatePayload,
} from '../models';

type TaskApiResponse = {
    _id?: string;
    id?: string;
    Name?: string;
    name?: string;
    text?: string;
    title?: string;
    content?: string;
    description?: string;
    status?: string | boolean;
    completed?: boolean;
    done?: boolean;
    isDone?: boolean;
};

type TasksListResponse = TaskApiResponse[] | { data?: TaskApiResponse[] };

const getTaskText = (payload: { text: string }) => ({
    Name: payload.text,
    name: payload.text,
    text: payload.text,
    title: payload.text,
    content: payload.text,
    description: payload.text,
});

export const getTasks = async (axios: AxiosInstance): Promise<Task[]> => {
    const { data } = await axios.get<TasksListResponse>('tasks');
    const taskList = Array.isArray(data) ? data : (data.data ?? []);
    return taskList.map(normalizeTask).filter((task) => Boolean(task.id));
};

export const createTask = async (
    axios: AxiosInstance,
    payload: TaskCreatePayload,
): Promise<Task> => {
    const { data } = await axios.post<TaskApiResponse>('tasks', getTaskText(payload));
    return normalizeTask(data);
};

export const updateTask = async (
    axios: AxiosInstance,
    id: string,
    payload: TaskUpdatePayload,
): Promise<Task> => {
    const { data } = await axios.put<TaskApiResponse>(`tasks/${id}`, getTaskText(payload));
    return normalizeTask(data);
};

export const deleteTask = async (axios: AxiosInstance, id: string): Promise<void> => {
    await axios.delete(`tasks/${id}`);
};

export const toggleTaskStatus = async (
    axios: AxiosInstance,
    task: Task,
): Promise<Task> => {
    const nextStatus = task.status === 'Pendiente' ? 'Finalizada' : 'Pendiente';
    const { data } = await axios.patch<TaskApiResponse>(`tasks/${task.id}`, {
        status: nextStatus,
        completed: nextStatus === 'Finalizada',
        done: nextStatus === 'Finalizada',
        isDone: nextStatus === 'Finalizada',
    });
    return normalizeTask(data);
};