import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  username: string = '';
  email: string = '';

  constructor(private firestore: Firestore, private router: Router) {}

  async recuperar() {
    // Validación de formato de correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      alert('Por favor, ingresa un correo válido.');
      return;
    }

    try {
      // Realiza una consulta a la colección 'usuarios' buscando solo por correo electrónico
      const usersRef = collection(this.firestore, 'usuarios');
      const q = query(usersRef, where('Correo', '==', this.email)); // Solo filtro por correo
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Filtrar por nombre de usuario en el código
        const userDoc = querySnapshot.docs.find(doc => doc.data()['Nombre/usuario'] === this.username);
        
        if (userDoc) {
          // Generar una nueva contraseña temporal
          const tempPassword = Math.random().toString(36).slice(-8);

          // Actualizar la contraseña del usuario en Firestore
          const userRef = doc(this.firestore, 'usuarios', userDoc.id); // Obtiene la referencia del documento
          await updateDoc(userRef, { 'COntraseña': tempPassword });

          // Aquí deberías enviar un correo (esto lo manejaría el backend, en este caso solo simula el envío)
          alert(
            `Se ha enviado un correo de recuperación a ${this.email}. Tu contraseña temporal es: ${tempPassword}`
          );

          // Redirigir al usuario al login
          this.router.navigate(['/login']);
        } else {
          alert('Nombre de usuario o correo electrónico incorrectos.');
        }
      } else {
        alert('No se encontró el usuario con ese correo electrónico.');
      }
    } catch (error) {
      console.error('Error al recuperar la contraseña:', error);
      alert('Ocurrió un error al restablecer la contraseña. Intenta de nuevo.');
    }
  }
}
