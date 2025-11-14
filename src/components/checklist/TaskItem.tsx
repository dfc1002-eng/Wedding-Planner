
import React from 'react';
import { Task } from '../../types';
import Icon from '../ui/Icon';

interface TaskItemProps {
    task: Task;
    onToggleTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleTask }) => {
    const isImportantAndIncomplete = task.isImportant && !task.completed;

    return (
        <div className={`p-4 rounded-lg flex items-center justify-between transition-colors ${task.completed ? 'bg-green-50 dark:bg-green-900/50 text-gray-400' : 'bg-white dark:bg-brand-pink-light dark:text-brand-gray shadow-sm'} ${isImportantAndIncomplete ? 'border-l-4 border-brand-gold' : ''}`}>
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id={`task-${task.id}`}
                    checked={task.completed} 
                    onChange={() => onToggleTask(task.id)}
                    className="h-5 w-5 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                />
                <label htmlFor={`task-${task.id}`} className={`ml-3 text-sm cursor-pointer ${task.completed ? 'line-through' : ''} ${isImportantAndIncomplete ? 'font-bold' : ''}`}>
                    {task.title}
                </label>
            </div>
            {isImportantAndIncomplete && <Icon name="star" className="text-yellow-500" />}
        </div>
    );
};

export default TaskItem;
