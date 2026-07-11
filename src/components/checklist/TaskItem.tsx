import React from 'react';
import { Task } from '../../types';
import Icon from '../ui/Icon';

interface TaskItemProps {
    task: Task;
    onToggleTask: (id: string) => void;
}

// Componente interno para renderizar cada tarefa (Versão Padronizada)
const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleTask }) => (
  <div 
    onClick={() => onToggleTask(task.id)}
    className={`p-4 flex items-start group cursor-pointer border border-transparent rounded-lg hover:bg-white hover:shadow-sm hover:border-gray-100 dark:hover:bg-gray-700/50 transition-all ${task.completed ? 'opacity-60' : ''}`}
  >
    {/* Checkbox (Círculo) */}
    <div className={`mt-0.5 mr-4 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
      task.completed 
        ? 'bg-brand-green border-brand-green' 
        : 'border-gray-300 dark:border-gray-500 group-hover:border-brand-gold'
    }`}>
      {task.completed && <Icon name="check" className="text-white text-sm" />}
    </div>
    
    {/* Conteúdo da Tarefa */}
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className={`text-base font-medium transition-all ${
          task.completed 
            ? 'text-gray-400 dark:text-gray-500 line-through' 
            : 'text-brand-gray dark:text-gray-200'
        }`}>
          {task.title}
        </p>
      </div>
      
      {/* Categoria (Se houver) */}
      {task.category && (
         <span className="inline-block mt-1 text-xs text-brand-gold border border-brand-gold/30 px-2 py-0.5 rounded">
           {task.category}
         </span>
      )}
    </div>
  </div>
);

export default TaskItem;
