import React, { useMemo, useState } from 'react';
import { useWedding } from '../context/WeddingDataContext';
import { Task } from '../types';
import TaskItem from '../components/checklist/TaskItem';
import Icon from '../components/ui/Icon';

interface ChecklistScreenProps {
    onToggleTask: (id: string) => void;
}

const ChecklistScreen: React.FC<ChecklistScreenProps> = ({ onToggleTask }) => {
    const { tasks, populateDefaultTasks } = useWedding();
    const [collapsedTimeframes, setCollapsedTimeframes] = useState<Set<string>>(new Set());
    const [isGenerating, setIsGenerating] = useState(false);

    const processedData = useMemo(() => {
        // 1. Agrupar
        const grouped = tasks.reduce((acc: Record<string, Task[]>, task) => {
            const timeframe = task.timeframe;
            if (!acc[timeframe]) {
                acc[timeframe] = [];
            }
            acc[timeframe].push(task);
            return acc;
        }, {} as Record<string, Task[]>);

        // 2. Definir ordem dos grupos
        const timeframeOrder = [
            '12-18 MESES ANTES',
            '10 MESES ANTES',
            '8 MESES ANTES',
            '6 MESES ANTES',
            '3 MESES ANTES',
            '1 MÊS ANTES',
            'CHECKLIST DA SEMANA DO CASAMENTO'
        ];

        // 3. Criar array ordenado e ordenar tarefas internas
        return Object.keys(grouped)
            .sort((a, b) => {
                 const indexA = timeframeOrder.indexOf(a);
                 const indexB = timeframeOrder.indexOf(b);
                 // If not found in order, put at the end
                 const valA = indexA === -1 ? 999 : indexA;
                 const valB = indexB === -1 ? 999 : indexB;
                 return valA - valB;
            })
            .map(timeframe => {
                const tasksInGroup = grouped[timeframe];
                // Ordenar tarefas: importantes e incompletas primeiro
                const sortedTasks = [...tasksInGroup].sort((a, b) => {
                    const aIsImportantAndIncomplete = a.isImportant && !a.completed;
                    const bIsImportantAndIncomplete = b.isImportant && !b.completed;

                    if (aIsImportantAndIncomplete && !bIsImportantAndIncomplete) return -1;
                    if (!aIsImportantAndIncomplete && bIsImportantAndIncomplete) return 1;
                    return 0; 
                });

                return {
                    timeframe,
                    tasks: sortedTasks
                };
            });
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

    const handleGenerateChecklist = async () => {
        setIsGenerating(true);
        try {
            await populateDefaultTasks();
        } catch (error) {
            console.error("Erro ao gerar checklist:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (tasks.length === 0) {
        return (
             <div>
                <h2 className="text-3xl font-title text-brand-gray dark:text-white mb-6">Checklist do Casamento</h2>
                <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                    <Icon name="assignment" className="text-6xl text-brand-gold mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Sua lista de tarefas está vazia</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                        Comece com o pé direito! Gere uma lista de tarefas completa e personalizada baseada em recomendações de especialistas.
                    </p>
                    <button
                        onClick={handleGenerateChecklist}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-brand-gold text-white px-6 py-3 rounded-full font-bold hover:bg-brand-gold-dark transition-colors disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Icon name="refresh" className="animate-spin" />
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Icon name="auto_awesome" />
                                Gerar Checklist Automático
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-title text-brand-gray dark:text-white mb-6">Checklist do Casamento</h2>
            <div className="space-y-8">
                {processedData.map(({ timeframe, tasks }) => {
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
                                    {tasks.map(task => (
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