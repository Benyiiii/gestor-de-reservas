import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  username: string = '';
  email: string = '';

  constructor(private router: Router) {}

  recuperar() {
    // Validación de formato de correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      alert('Por favor, ingresa un correo válido.');
      return;
    }

    // Obtener usuarios desde localStorage
    const storedUsers = localStorage.getItem('usuarios');
    if (!storedUsers) {
      alert('No hay usuarios registrados en el sistema.');
      return;
    }

    // Convertir el JSON a un array de objetos
    const users = JSON.parse(storedUsers);

    // Buscar el usuario por nombre de usuario y correo electrónico
    const user = users.find(
      (u: any) => u.username === this.username && u.email === this.email
    );

    if (user) {
      // Generar una contraseña temporal
      const tempPassword = Math.random().toString(36).slice(-8);
      user.password = tempPassword;

      // Guardar los cambios en localStorage
      localStorage.setItem('usuarios', JSON.stringify(users));

      // Mostrar la nueva contraseña
      alert(
        `Se ha enviado un correo de recuperación a ${this.email}. Tu contraseña temporal es: ${tempPassword}`
      );

      // Redirigir al usuario al login
      this.router.navigate(['/login']);
    } else {
      alert('Nombre de usuario o correo electrónico incorrectos.');
    }
  }
}
