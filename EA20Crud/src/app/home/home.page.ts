import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Task } from '../task.service';
import { TaskService } from '../task.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonButton,
    IonInput,
    FormsModule, CommonModule
  ],
})
export class HomePage implements OnInit {

  tasks$!: Observable<Task[]>;
  newTaskName: string = '';
  newPriceName: string = '';

  //almacenes temporales para las variables que se van a editarr
  editingTaskId: string | null = null;
  editedTaskName: string = '';
  editedPriceName: string = '';

  constructor(private taskService: TaskService, private router: Router, private authService: AuthService, private alertController: AlertController) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks$ = this.taskService.getTasks();
  }

  addTask() {
    const name = this.newTaskName.trim();
    const price = this.newPriceName.trim();

    if (!name) {
      alert('El nombre del producto es obligatorio');
      return;
    }

    if (!price) {
      alert('El precio del producto es obligatorio');
      return;
    }

    const newTask: Task = { name, price };

    this.taskService.addTask(newTask)
      .then(() => {
        console.log('Producto agregado');
        this.newTaskName = '';
        this.newPriceName = '';
      })
      .catch((err: unknown) => console.error('Error al agregar el producto:', err));
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id)
      .then(() => console.log('Producto eliminado'))
      .catch((err: unknown) => console.error('Error al eliminar el producto:', err));
  }

  //edicion de tareas inicia ;D

  startEdit(task: Task) {
    this.editingTaskId = task.id!;
    this.editedTaskName = task.name;
    this.editedPriceName = task.price;
  }

  //guardar los cambios de la edicion

  saveEdit(taskId: string) {
    const name = this.editedTaskName.trim();
    const price = this.editedPriceName.trim();

    if (!name) {
      alert('El nombre del producto es obligatorio');
      return;
    }

    if (!price) {
      alert('El precio del producto es obligatorio');
      return;
    }

    this.taskService.updateTask(taskId, { name, price })
      .then(() => {
        console.log('Producto actualizado');
        this.editingTaskId = null;    // Terminamos la edición
        this.editedTaskName = '';     // Limpiamos el campo de edición
        this.editedPriceName = '';
      })
      .catch((err: unknown) => console.error('Error al actualizar producto: ', err));
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo cerrar sesión. Inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}