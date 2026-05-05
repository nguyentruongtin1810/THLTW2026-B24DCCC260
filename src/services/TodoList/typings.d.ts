declare module TodoList {
	export type TaskStatus = 'todo' | 'inprogress' | 'done';
	export type TaskPriority = 'High' | 'Medium' | 'Low';

	export interface TodoItem {
		id: string;
		name: string;
		description: string;
		deadline: string;
		priority: TaskPriority;
		tags: string[];
		status: TaskStatus;
		color: string;
	}
}
