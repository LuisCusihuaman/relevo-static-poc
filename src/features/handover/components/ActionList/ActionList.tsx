import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckSquare, Clock,
  History,
  Plus,
  Send, Trash2,
  X
} from 'lucide-react';
import React, { useState } from 'react';

interface Collaborator {
  id: number;
  name: string;
  initials: string;
  color: string;
  role: string;
}

interface ActionItem {
  id: number;
  task: string;
  priority: 'low' | 'medium' | 'high';
  dueTime?: string;
  completed: boolean;
  submittedBy: string;
  submittedTime: string;
  submittedDate: string;
  shift: string;
}

interface ActionListProps {
  expanded?: boolean;
  collaborators?: Collaborator[];
  onOpenThread?: (section: string) => void;
  focusMode?: boolean;
  compact?: boolean;
  currentUser?: {
    name: string;
    initials: string;
    role: string;
  };
  assignedPhysician?: {
    name: string;
    initials: string;
    role: string;
  };
}

export function ActionList({ 
  expanded = false, 
  collaborators = [], 
  onOpenThread,
  focusMode = false,
  compact = false,
  currentUser = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' },
  assignedPhysician = { name: 'Dr. Johnson', initials: 'DJ', role: 'Day Attending' }
}: ActionListProps) {
  // Action items from multiple shifts - persistent until completed or handover ends
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    // Previous Night Shift tasks (still pending)
    {
      id: 1,
      task: "Follow up on blood culture results from yesterday - patient spiked fever at 02:00",
      priority: "high",
      dueTime: "Before rounds",
      completed: false,
      submittedBy: "Dr. Park",
      submittedTime: "02:15",
      submittedDate: "Last night",
      shift: "Night → Day"
    },
    {
      id: 2,
      task: "Cardiology consult for new murmur detected during admission",
      priority: "medium",
      dueTime: "Today",
      completed: false,
      submittedBy: "Dr. Kim",
      submittedTime: "23:45",
      submittedDate: "Last night",
      shift: "Night → Day"
    },
    // Current Day Shift tasks  
    {
      id: 3,
      task: "Discuss discharge planning with family - daughter will be here at 14:00",
      priority: "medium",
      completed: true,
      submittedBy: "Dr. Johnson",
      submittedTime: "09:30",
      submittedDate: "Today",
      shift: "Day → Evening"
    },
    {
      id: 4,
      task: "Review chest X-ray results and adjust oxygen therapy accordingly",
      priority: "high",
      dueTime: "Evening rounds",
      completed: false,
      submittedBy: "Dr. Martinez",
      submittedTime: "11:15",
      submittedDate: "Today", 
      shift: "Day → Evening"
    },
    {
      id: 5,
      task: "Monitor urine output closely - patient had decreased output this afternoon",
      priority: "high",
      dueTime: "Q2H checks",
      completed: false,
      submittedBy: "Nurse Clara",
      submittedTime: "15:30",
      submittedDate: "Today",
      shift: "Day → Evening"
    }
  ]);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ 
    task: '', 
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user can delete tasks (only assigned physician for current shift)
  const canDeleteTasks = currentUser.name === assignedPhysician.name;

  // Group tasks by status only - no urgent separation
  const pendingTasks = actionItems.filter(item => !item.completed);
  const completedTasks = actionItems.filter(item => item.completed);

  // Submit new task
  const handleSubmitTask = () => {
    if (!newTask.task.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const task: ActionItem = {
        id: Date.now(),
        task: newTask.task.trim(),
        priority: newTask.priority,
        dueTime: newTask.dueTime.trim() || undefined,
        completed: false,
        submittedBy: currentUser.name,
        submittedTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        submittedDate: 'Today',
        shift: 'Day → Evening'
      };
      
      setActionItems(prev => [...prev, task]);
      setNewTask({ task: '', priority: 'medium', dueTime: '' });
      setShowNewTaskForm(false);
      setIsSubmitting(false);
    }, 500);
  };

  // Toggle task completion
  const handleToggleComplete = (taskId: number) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Delete task (only current shift tasks by assigned physician)
  const handleDeleteTask = (taskId: number) => {
    const task = actionItems.find(t => t.id === taskId);
    if (!canDeleteTasks || task?.shift !== "Day → Evening") return;
    
    setActionItems(prev => prev.filter(item => item.id !== taskId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmitTask();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 border-red-200 bg-red-50';
      case 'medium': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'low': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  // Clean task card component
  const TaskCard = ({ task }: { task: ActionItem }) => (
    <div className={`p-4 rounded-lg border transition-all hover:shadow-sm group ${
      task.completed 
        ? 'border-gray-200 bg-gray-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="space-y-3">
        {/* Task Header with Checkbox */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Checkbox
              checked={task.completed}
              onCheckedChange={focusMode ? undefined : () => handleToggleComplete(task.id)}
              disabled={focusMode}
              className={`mt-1 ${task.completed ? 'bg-gray-600 border-gray-600' : ''}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`text-xs px-2 py-1 rounded border font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.task}
              </p>
            </div>
          </div>
          
          {/* Delete button - Only for current shift tasks by assigned physician */}
          {!focusMode && canDeleteTasks && task.shift === "Day → Evening" && !task.completed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {/* Task Details */}
        <div className={`flex items-center justify-between text-xs pt-2 border-t ${
          task.completed ? 'border-gray-100 text-gray-400' : 'border-gray-100 text-gray-500'
        }`}>
          <div className="flex items-center space-x-3">
            {task.dueTime && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{task.dueTime}</span>
              </div>
            )}
          </div>
          <span className={task.completed ? 'text-gray-400' : 'text-gray-500'}>{task.submittedBy} • {task.submittedTime}</span>
        </div>
      </div>
    </div>
  );

  if (compact) {
    // Compact version for sidebar
    return (
      <div className="space-y-4">
        {/* Quick Stats */}
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Action Items</h4>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {pendingTasks.length} pending
            </Badge>
            {completedTasks.length > 0 && (
              <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                {completedTasks.length} done
              </Badge>
            )}
          </div>
        </div>

        {/* Pending Tasks - Limited */}
        {pendingTasks.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Pending</h5>
            {pendingTasks.slice(0, 3).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {pendingTasks.length > 3 && (
              <p className="text-xs text-gray-500 text-center py-2">
                +{pendingTasks.length - 3} more tasks
              </p>
            )}
          </div>
        )}

        {/* Completed Tasks - Limited in Compact Mode */}
        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-600">Completed</h5>
            {completedTasks.slice(0, 2).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {completedTasks.length > 2 && (
              <p className="text-xs text-gray-500 text-center py-2">
                +{completedTasks.length - 2} more completed
              </p>
            )}
          </div>
        )}

        {/* Add New Task - Compact Form */}
        {!focusMode && !showNewTaskForm ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewTaskForm(true)}
            className="w-full text-xs border-gray-200 hover:bg-gray-50"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Task
          </Button>
        ) : (!focusMode && (
          <div className="p-3 border border-gray-200 rounded-lg bg-gray-25">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900 text-sm">New Task</h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewTaskForm(false)}
                  className="h-5 w-5 p-0"
                  disabled={isSubmitting}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <Textarea
                    value={newTask.task}
                    onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe the task..."
                    className="min-h-[50px] text-sm border-gray-300 focus:border-blue-400 focus:ring-blue-100 bg-white resize-none"
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                      className="w-full p-1.5 text-xs border border-gray-300 rounded bg-white focus:border-blue-400 focus:ring-blue-100"
                      disabled={isSubmitting}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      value={newTask.dueTime}
                      onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                      placeholder="Due time"
                      className="w-full p-1.5 text-xs border border-gray-300 rounded bg-white focus:border-blue-400 focus:ring-blue-100"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewTaskForm(false)}
                  className="text-xs px-2 py-1 h-7 border-gray-300 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitTask}
                  disabled={!newTask.task.trim() || isSubmitting}
                  className="text-xs px-2 py-1 h-7 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Send className="w-2 h-2 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Full version - No Card container, direct content
  return (
    <div className="space-y-6">
      {/* Status Header - Clean and Simple */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs">
            {pendingTasks.length} pending
          </Badge>
          {completedTasks.length > 0 && (
            <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-xs">
              {completedTasks.length} done
            </Badge>
          )}
        </div>
      </div>

      {/* Cross-Shift Persistence Notice */}
      <div className="p-3 bg-blue-25 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-800 text-sm">
          <History className="w-4 h-4" />
          <span className="font-medium">Tasks persist across shifts until completed</span>
        </div>
        <p className="text-blue-700 text-xs mt-1">
          Current shift: Day → Evening
        </p>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-900">Pending</h4>
            </div>
            <Badge variant="outline" className="text-xs">
              {pendingTasks.length} active
            </Badge>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-gray-600">Completed</h4>
            </div>
            <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
              {completedTasks.length} done
            </Badge>
          </div>
          <div className="space-y-3">
            {completedTasks.slice(0, 3).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {completedTasks.length > 3 && (
              <p className="text-xs text-gray-500 text-center py-2">
                +{completedTasks.length - 3} more completed
              </p>
            )}
          </div>
        </div>
      )}

      <Separator className="border-gray-200" />

      {/* Add New Task - Clean Form */}
      {!focusMode && !showNewTaskForm ? (
        <Button
          variant="outline"
          onClick={() => setShowNewTaskForm(true)}
          className="w-full text-gray-600 border-gray-200 hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Action Item
        </Button>
      ) : (!focusMode && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-25">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-gray-900">New Action Item</h5>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewTaskForm(false)}
                className="h-6 w-6 p-0"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Task Description:
                </label>
                <Textarea
                  value={newTask.task}
                  onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., Follow up on lab results, Contact cardiology for consult..."
                  className="min-h-[60px] border-gray-300 focus:border-blue-400 focus:ring-blue-100 bg-white"
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Priority:
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-400 focus:ring-blue-100"
                    disabled={isSubmitting}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Due Time:
                  </label>
                  <input
                    type="text"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                    placeholder="e.g., Before rounds, Today, 18:00"
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-400 focus:ring-blue-100"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewTaskForm(false)}
                className="text-xs border-gray-300 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitTask}
                disabled={!newTask.task.trim() || isSubmitting}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 mr-1" />
                    Submit Task
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}