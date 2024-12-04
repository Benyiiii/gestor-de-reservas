import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
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

    // Verificar las credenciales
    const user = users.find(
      (u: any) => u.email === this.email && u.password === this.password
    );

    if (user) {
      // Almacenar datos del usuario que inició sesión
      localStorage.setItem('loggedUser', JSON.stringify(user));

      // Navegar a la página de inicio
      this.router.navigate(['/inicio'], {
        queryParams: { username: user.username, email: user.email },
      });
    } else {
      alert('Correo o contraseña incorrectos.');
    }
  }
}