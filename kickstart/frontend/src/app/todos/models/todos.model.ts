export interface TodoItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface NewTodoItem {
  title: string;
  description?: string;
}

export interface TodoItemFilter {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}
