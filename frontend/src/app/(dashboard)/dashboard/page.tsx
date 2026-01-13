"use client";

import * as React from "react";
import { Plus, LayoutGrid, ListChecks, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { TaskCard, Task } from "@/components/modules/task-card";
import { TaskForm } from "@/components/modules/task-form";
import { Search } from "@/components/modules/task-search";
import { TaskFilters, TaskStatus } from "@/components/modules/task-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { api } from "@/lib/api-client";

export default function DashboardPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus>("all");

  // Load tasks from Backend
  const fetchTasks = React.useCallback(async () => {
    try {
      const data = await api.get<Task[]>("/tasks", {
        params: { status: statusFilter, sort: "created" }
      });
      setTasks(data);
    } catch (err: any) {
      toast(err.message || "Failed to load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, toast]);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleTask = async (id: string) => {
    try {
      const updatedTask = await api.patch<Task>(`/tasks/${id}/complete`, {});
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      toast(updatedTask.completed ? "Task completed!" : "Task reopened", "success");
    } catch (err: any) {
      toast(err.message || "Failed to toggle task", "error");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast("Task deleted permanently", "info");
    } catch (err: any) {
      toast(err.message || "Failed to delete task", "error");
    }
  };

  const handleSubmitTask = async (data: any) => {
    try {
      if (editingTask) {
        const updatedTask = await api.put<Task>(`/tasks/${editingTask.id}`, data);
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
        toast("Task updated successfully", "success");
      } else {
        const newTask = await api.post<Task>("/tasks", data);
        setTasks([newTask, ...tasks]);
        toast("New task created", "success");
      }
      setIsModalOpen(false);
      setEditingTask(undefined);
    } catch (err: any) {
      toast(err.message || "Failed to save task", "error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s an overview of your productivity today.
          </p>
        </div>
        <Button onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }} className="h-11">
          <Plus className="mr-2 h-5 w-5" /> New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Tasks</p>
              <h2 className="text-3xl font-bold">{tasks.length}</h2>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
              <ListChecks className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending</p>
              <h2 className="text-3xl font-bold">{tasks.filter(t => !t.completed).length}</h2>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-2xl bg-success flex items-center justify-center text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completed</p>
              <h2 className="text-3xl font-bold">{tasks.filter(t => t.completed).length}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Search value={searchQuery} onChange={setSearchQuery} />
        <TaskFilters currentStatus={statusFilter} onStatusChange={setStatusFilter} />
      </div>

      {/* Task List Section */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-500 animate-pulse font-medium">Fetching your tasks...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={searchQuery ? "No matching tasks" : "No tasks found"}
            description={
              searchQuery
                ? `We couldn't find any tasks matching "${searchQuery}".`
                : "Your task list is empty. Start by creating a new task to track your progress."
            }
          />
        )}
      </div>

      {/* Task Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(undefined); }}
        title={editingTask ? "Edit Task" : "Create New Task"}
        description={editingTask ? "Update the details of your task." : "Fill in the details below to add a new task."}
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={() => { setIsModalOpen(false); setEditingTask(undefined); }}
        />
      </Modal>
    </div>
  );
}
