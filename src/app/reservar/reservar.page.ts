import { Component } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
})
export class ReservarPage {
  hoy: string = new Date().toISOString();
  selectedDate: string = this.hoy.split('T')[0]; // Solo la fecha
  secciones: { hora: string; disponible: boolean }[] = [];
  correoUsuario: string = '';
  seccionSeleccionada: { hora: string; disponible: boolean } | null = null;
  mensajeReserva: string = '';
  mensaje: string = '';

  constructor(private firestore: Firestore) {
    this.secciones = [
      { hora: '08:30-10:00', disponible: true },
      { hora: '10:00-11:30', disponible: true },
      { hora: '11:30-13:00', disponible: true },
      { hora: '13:00-14:30', disponible: true },
      { hora: '14:30-16:00', disponible: true },
      { hora: '16:00-17:30', disponible: true },
    ];
  }

  // Método para cargar las secciones según la fecha seleccionada
  async cargarSecciones() {
    console.log('Fecha seleccionada:', this.selectedDate);

    // Verificar que la fecha es válida
    if (!this.selectedDate) {
      console.error('Fecha no válida');
      return;
    }

    // Crear la referencia al documento de Firestore
    const fechaDocRef = doc(this.firestore, `reservas/${this.selectedDate}`);

    try {
      const docSnapshot = await getDoc(fechaDocRef);

      // Verificar si el documento existe
      if (docSnapshot.exists()) {
        const reservas = docSnapshot.data() || {};

        console.log('Reservas para la fecha seleccionada:', reservas);

        // Cargar la disponibilidad de las secciones
        this.secciones.forEach((seccion) => {
          const usuariosEnSeccion = reservas[seccion.hora]
            ? Object.keys(reservas[seccion.hora]).length
            : 0;
          seccion.disponible = usuariosEnSeccion < 20;
        });
      } else {
        // Si no hay documento para la fecha, todas las secciones están disponibles
        console.log('No hay reservas para esta fecha. Estableciendo todas las secciones como disponibles.');
        this.secciones.forEach((seccion) => (seccion.disponible = true));
      }

      console.log('Secciones cargadas:', this.secciones);
    } catch (error) {
      console.error('Error al cargar las secciones desde Firestore:', error);
      alert('Error al cargar las secciones desde Firestore. Revisar consola para más detalles.');
    }
  }

  // Método para confirmar la reserva
  async confirmarReserva() {
    if (!this.correoUsuario || !this.seccionSeleccionada) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    console.log('Sección seleccionada:', this.seccionSeleccionada);
    console.log('Correo del usuario:', this.correoUsuario);

    try {
      const fechaDocRef = doc(this.firestore, `reservas/${this.selectedDate}`);
      const hora = this.seccionSeleccionada.hora;

      // Obtenemos las reservas existentes
      const docSnapshot = await getDoc(fechaDocRef);
      let reservas: any = {};

      if (docSnapshot.exists()) {
        reservas = docSnapshot.data() || {};
      }

      console.log('Reservas actuales:', reservas);

      // Verificamos el cupo de la sección
      const usuariosEnSeccion = reservas[hora]
        ? Object.keys(reservas[hora]).length
        : 0;

      if (usuariosEnSeccion < 20) {
        // Agregar la reserva
        if (!reservas[hora]) {
          reservas[hora] = {};
        }
        reservas[hora][this.correoUsuario] = true;

        // Imprimir los datos antes de guardar para depuración
        console.log('Datos antes de guardar:', reservas);

        // Guardamos la reserva en Firestore
        await setDoc(fechaDocRef, reservas, { merge: true });

        // Imprimir después de guardar para verificar
        console.log('Reserva guardada.');

        this.mensajeReserva = `Reserva confirmada para ${this.selectedDate} a las ${hora}.`;
      } else {
        alert('La sección seleccionada ya no está disponible.');
      }

      this.correoUsuario = '';
      this.seccionSeleccionada = null;
      this.cargarSecciones();
    } catch (error) {
      console.error('Error al confirmar la reserva:', error);
      alert('Error al confirmar la reserva.');
    }
  }

  // Método para eliminar la reserva
  async eliminarReserva() {
    if (!this.seccionSeleccionada) {
      alert('No hay una reserva seleccionada para eliminar.');
      return;
    }

    try {
      const fechaDocRef = doc(this.firestore, `reservas/${this.selectedDate}`);
      const hora = this.seccionSeleccionada.hora;

      // Obtenemos las reservas existentes
      const docSnapshot = await getDoc(fechaDocRef);
      let reservas: any = {};

      if (docSnapshot.exists()) {
        reservas = docSnapshot.data() || {};
      }

      console.log('Reservas antes de eliminar:', reservas);

      // Verificar si el usuario está en la reserva
      if (reservas[hora] && reservas[hora][this.correoUsuario]) {
        delete reservas[hora][this.correoUsuario];  // Eliminar la reserva

        // Guardar los cambios
        await setDoc(fechaDocRef, reservas, { merge: true });

        this.mensajeReserva = `Reserva eliminada para ${this.selectedDate} a las ${hora}.`;
        this.seccionSeleccionada = null;
      } else {
        alert('No se encontró una reserva con ese correo en la sección seleccionada.');
      }

    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      alert('Error al eliminar la reserva.');
    }
  }
}
