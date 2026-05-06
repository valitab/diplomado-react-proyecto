export type TaskStatus = 'Pendiente' | 'Finalizada';

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

export interface Task {
    id: string;
    text: string;
    status: TaskStatus;
}

export interface TaskCreatePayload {
    text: string;
}

export interface TaskUpdatePayload {
    text: string;
}

export const normalizeTask = (task: TaskApiResponse): Task => {
    const id = task._id ?? task.id ?? '';
    const text =
        task.Name ??
        task.name ??
        task.text ??
        task.title ??
        task.content ??
        task.description ??
        '';

    const isFinalized =
        task.completed === true ||
        task.done === true ||
        task.isDone === true ||
        task.status === true ||
        task.status?.toString().toLowerCase() === 'finalizada';

    return {
        id,
        text,
        status: isFinalized ? 'Finalizada' : 'Pendiente',
    };
};