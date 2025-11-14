import React, { useMemo, useState } from 'react';
import { useWedding } from '../context/WeddingDataContext';
import { Task } from '../types';
import TaskItem from '../components/checklist/TaskItem';
import Icon from '../components/ui/Icon';

interface ChecklistScreenProps {
    onToggleTask: (id: string) => void;
}

const ChecklistScreen: React.FC<ChecklistScreenProps> = ({ onToggleTask }) => {
    const { tasks } = useWedding();
    const [collapsedTimeframes, setCollapsedTimeframes] = useState<Set<string>>(new Set());

    const tasksByTimeframe = useMemo(() => {
        return tasks.reduce((acc: Record<string, Task[]>, task) => {
            const timeframe = task.timeframe;
            if (!acc[timeframe]) {
                acc[timeframe] = [];
            }
            acc[timeframe].push(task);
            return acc;
        }, {} as Record<string, Task[]>);
    }, [tasks]);

    const sortedTimeframes = useMemo(() => {
        const order = [
            '12 - 18 MESES ANTES',
            '10 MESES ANTES',
            '8 MESES ANTES',
            '6 MESES ANTES',
            '3 MESES ANTES',
            '1 MÊS ANTES',
            'CHECKLIST DA SEMANA DO CASAMENTO'
        ];
        return Object.keys(tasksByTimeframe).sort((a, b) => order.indexOf(a) - order.indexOf(b));
    }, [tasksByTimeframe]);

    const handleToggleTimeframe = (timeframe: string) => {
        setCollapsedTimeframes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(timeframe)) {
                newSet.delete(timeframe);
            } else {
                newSet.add(timeframe);
            }
            return newSet;
        });
    };

    return (
        <div>
            <h2 className="text-3xl font-title text-brand-gray dark:text-white mb-6">Checklist do Casamento</h2>
            <div className="space-y-8">
                {sortedTimeframes.map((timeframe) => {
                    const tasksInGroup = tasksByTimeframe[timeframe];
                    const isCollapsed = collapsedTimeframes.has(timeframe);

                    // Sort tasks within the group: important and incomplete first, then others
                    const sortedTasksInGroup = [...tasksInGroup].sort((a, b) => {
                        const aIsImportantAndIncomplete = a.isImportant && !a.completed;
                        const bIsImportantAndIncomplete = b.isImportant && !b.completed;

                        if (aIsImportantAndIncomplete && !bIsImportantAndIncomplete) return -1;
                        if (!aIsImportantAndIncomplete && bIsImportantAndIncomplete) return 1;
                        return 0; // Maintain original order for tasks of same importance/completion status
                    });

                    return (
                        <div key={timeframe}>
                            <button
                                onClick={() => handleToggleTimeframe(timeframe)}
                                className="w-full flex justify-between items-center text-left text-xl font-bold text-brand-gold mb-4 pb-2 border-b-2 border-brand-pink-light dark:border-gray-700 hover:opacity-80 transition-opacity"
                                aria-expanded={!isCollapsed}
                                aria-controls={`tasks-${timeframe}`}
                            >
                                <span>{timeframe}</span>
                                <Icon name={isCollapsed ? 'expand_more' : 'expand_less'} className="text-2xl" />
                            </button>
                            {!isCollapsed && (
                                <div id={`tasks-${timeframe}`} className="space-y-3">
                                    {sortedTasksInGroup.map(task => (
                                       <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChecklistScreen;