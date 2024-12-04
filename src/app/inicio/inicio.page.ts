import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  username: string = '';
  email: string = '';
  motivationalQuote: string = '';
  previousQuotes: Set<string> = new Set(); 
  openAiApiKey = 'NxYtedz15f6fTkOsASxpfH0G0qBn61DnfnoQKeBH0UrPPGLGpOID_54T47iB9uJoPmzPlsCACcT3BlbkFJSy8edvireue943LqOvR3Fng8dn9AUu4rhpyEFXZ1IcScXM8dbdOgcCggR'; // Agrega tu clave de API aquí

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Asegúrate de que los parámetros sean correctos
    this.route.queryParams.subscribe(params => {
      if (params['username'] && params['email']) {
        this.username = params['username'];
        this.email = params['email'];
      } else {
        console.error('No se encontraron los parámetros');
      }
    });
  }

  // Función para obtener una frase motivacional
  getMotivationalQuote() {
    this.http.get<any>('http://localhost:3000/api/random-quote').subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.motivationalQuote = `${data[0].q} - ${data[0].a}`;
        } else {
          this.motivationalQuote = "No se encontró una frase motivacional.";
        }
      },
      (error) => {
        console.error("Error al obtener la frase: ", error);
        this.motivationalQuote = "Error al cargar la frase.";
      }
    );
  }
}
