import { Component} from '@angular/core';
import { TodosService, Todo } from '../todos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-todos',
  standalone: true,
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class TodosComponent{
  todos: Todo[] = [];
  todosFiltrado: Todo[] = [];
  todosFiltro: string = '';
  error: string | null = null;
  mostrarBoton: boolean = false;
  detalleTodo: Todo | null = null;
  mostrarModal: boolean = false;

  constructor(private todosService: TodosService) {}

  ngOnInit(): void {
    this.traerTodos();
  }

  traerTodos(): void {
    this.todosService.getTodos().subscribe({
      next: (data: Todo[]) => {
        this.todosFiltrado = data;
        this.todos = data;
      },
      error: (error) => {
        this.error = 'Error fetching todos';
        console.error(error);
      },
    });
  }

  filtrarTodos(): void {
    if (!this.todosFiltro) {
      this.mostrarBoton = false;
      this.todosFiltrado = this.todos;
    } else {
      const filter = this.todosFiltro.toLowerCase();
      this.todosFiltrado = this.todos.filter(todo =>
        todo.title.toLowerCase().includes(filter) ||
        todo.id.toString().includes(filter) ||
        todo.userId.toString().includes(filter) ||
        (todo.completed ? 'yes' : 'no').includes(filter)
      );
      if (this.todosFiltrado.length === 0) {
        this.error = 'No se encontraron resultados';
      } else {
        this.error = null;
      }
      this.mostrarBoton = true;
    }
  }

  verDetalles(todo: Todo): void {
    this.detalleTodo = todo;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.detalleTodo = null;
    this.mostrarModal = false;
  }
}
