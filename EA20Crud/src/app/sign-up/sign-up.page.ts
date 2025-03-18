import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonList, IonLabel, IonButton]
})
export class SignUpPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }


  async onSubmit() {
    console.log('Email ingresado:', this.email); // Depuración
    console.log('¿Es email válido?', this.validateEmail(this.email));

    //verificar si el email es valido
    if (!this.validateEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Invalid Email',
        message: 'Please enter a valid email address.',
        buttons: ['OK'],
      });
      await alert.present();
      return; // Evita que continúe con el registro si el email no es válido
    }

    try {
      await this.authService.register(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Signup Success',
        message: 'You have signed up successfully!',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Firebase Error:', error); // Para ver el error en la consola
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'An error ocurred during signup.', //nose porque siempre me aparece que ocurre un error durante el signup, pero ya esta implementado todo lo de Firebase y deberia servir
        buttons: ['OK'],
      });
      await alert.present();
    }


  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email.trim());
  }


  onSignup() {
    this.router.navigate(['/login']); // Redirige a la página de login
  }

}