import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  username: string = '';

  constructor(private firestore: AngularFirestore, private router: Router) {}

  async login() {
    if (!this.email || !this.password) {
      alert('Por favor, ingresa todos los campos.');
      return;
    }

    try {
      // Consultar la colección 'usuarios' donde 'Correo' coincide con el email ingresado
      const userRef = this.firestore.collection('usuarios', ref => 
        ref.where('Correo', '==', this.email) // Filtro por el campo 'Correo'
      );

      const querySnapshot = await userRef.get().toPromise(); // Obtener los documentos

      // Verificamos si encontramos algún usuario
      if (querySnapshot && querySnapshot.size > 0) {
        // Si se encuentran documentos, obtenemos el primer documento
        const userDoc = querySnapshot.docs[0]; // Obtener el primer documento
        const userData = userDoc.data() as { [key: string]: any }; // Aseguramos que `userData` tiene el tipo correcto

        console.log('userData', userData); // Verificar los datos del usuario

        // Verificamos la contraseña
        if (this.password === userData['COntraseña']) {
          const storedUsername = userData['Nombre/usuario']; // Obtener el nombre de usuario
          
          // Redirigir a la página de inicio
          this.router.navigate(['/inicio'], {
            queryParams: { username: storedUsername, email: this.email },
          });
        } else {
          alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
      } else {
        alert('Usuario no encontrado en la base de datos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error al iniciar sesión. Intenta de nuevo.');
    }
  }
}
