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
                {/* FIX: Replaced Object.entries with Object.keys to ensure proper type inference for tasksInGroup, resolving a "property 'map' does not exist on type 'unknown'" error. */}
                {Object.keys(tasksByTimeframe).map((timeframe) => {
                    const tasksInGroup = tasksByTimeframe[timeframe];
                    const isCollapsed = collapsedTimeframes.has(timeframe);
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
                                    {tasksInGroup.map(task => (
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
