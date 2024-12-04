import { Component } from '@angular/core';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
})
export class ReservarPage {
  hoy: string = new Date().toISOString();
  selectedDate: string = this.hoy;
  secciones: { hora: string; disponible: boolean }[] = [];
  reservas: Map<string, Map<string, string[]>> = new Map(); // Estructura para almacenar reservas
  mensaje: string = '';
  correoUsuario: string = ''; // Ahora usamos correo electrónico
  seccionSeleccionada: { hora: string; disponible: boolean } | null = null;
  mensajeReserva: string = '';

  constructor() {
    this.secciones = [
      { hora: '08:30-10:00', disponible: true },
      { hora: '10:00-11:30', disponible: true },
      { hora: '11:30-13:00', disponible: true },
      { hora: '13:00-14:30', disponible: true },
      { hora: '14:30-16:00', disponible: true },
      { hora: '16:00-17:30', disponible: true },
    ];
  }

  cargarSecciones() {
    const fechaSeleccionada = new Date(this.selectedDate);
    const diaDeLaSemana = fechaSeleccionada.getDay();

    if (diaDeLaSemana === 0 || diaDeLaSemana === 6) {
      this.mensaje = 'Las reservas están disponibles solo de lunes a viernes.';
      this.secciones = [];
      return;
    }

    this.mensaje = '';
    const reservasEnFecha = this.reservas.get(this.selectedDate) || new Map<string, string[]>();

    const todasReservas = Array.from(reservasEnFecha.values()).reduce((acc, val) => acc.concat(val), []);

    this.secciones.forEach((seccion) => {
      seccion.disponible = todasReservas.filter((hora) => hora === seccion.hora).length < 20;
    });
  }

  confirmarReserva() {
    if (!this.correoUsuario) {
      alert('Por favor, ingrese su correo electrónico.');
      return;
    }

    const fechaSeleccionada = new Date(this.selectedDate);
    const diaDeLaSemana = fechaSeleccionada.getDay();

    if (diaDeLaSemana === 0 || diaDeLaSemana === 6) {
      alert('No se permiten reservas los sábados ni domingos.');
      return;
    }

    // Verificar si el correo existe en el sistema (localStorage)
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioExiste = usuariosRegistrados.some((u: any) => u.email === this.correoUsuario);

    if (!usuarioExiste) {
      alert('El correo no está registrado en el sistema. Regístrese antes de reservar.');
      return;
    }

    if (this.seccionSeleccionada) {
      const reservasEnFecha = this.reservas.get(this.selectedDate) || new Map<string, string[]>();

      const todasReservas = Array.from(reservasEnFecha.values()).reduce((acc, val) => acc.concat(val), []);
      const reservasParaSeccion = todasReservas.filter((hora) => hora === this.seccionSeleccionada?.hora).length;

      if (reservasParaSeccion < 20) {
        const reservasUsuario = reservasEnFecha.get(this.correoUsuario) || [];
        reservasUsuario.push(this.seccionSeleccionada.hora);
        reservasEnFecha.set(this.correoUsuario, reservasUsuario);
        this.reservas.set(this.selectedDate, reservasEnFecha);

        const fechaFormateada = fechaSeleccionada.toISOString().split('T')[0];
        this.mensajeReserva = `Reserva confirmada para el ${fechaFormateada} a las ${this.seccionSeleccionada.hora}. Correo: ${this.correoUsuario}`;
        this.correoUsuario = '';
        this.seccionSeleccionada = null;
        this.cargarSecciones();
      } else {
        alert('La sección seleccionada no tiene cupo disponible.');
      }
    } else {
      alert('Error: No se ha seleccionado ninguna sección.');
    }
  }

  eliminarReserva() {
    const reservasEnFecha = this.reservas.get(this.selectedDate);

    if (reservasEnFecha && reservasEnFecha.has(this.correoUsuario)) {
      reservasEnFecha.delete(this.correoUsuario);
      this.reservas.set(this.selectedDate, reservasEnFecha);

      this.mensajeReserva = `Reserva eliminada para el ${this.selectedDate}.`;

      this.correoUsuario = '';
      this.cargarSecciones();
    } else {
      alert('No se encontró ninguna reserva para este correo.');
    }
  }

  modificarReserva() {
    if (!this.correoUsuario) {
      alert('Por favor, ingrese su correo para modificar la reserva.');
      return;
    }

    const reservasEnFecha = this.reservas.get(this.selectedDate);

    if (reservasEnFecha && reservasEnFecha.has(this.correoUsuario)) {
      reservasEnFecha.delete(this.correoUsuario);
      this.confirmarReserva();
    } else {
      alert('No se encontró ninguna reserva para este correo.');
    }
  }
}
