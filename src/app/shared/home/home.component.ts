import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbCarouselModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  slides = [
    {
      id: 1,
      src: './assets/images/home1.jpg',
      title: 'Innovación en Salud',
      subtitle: 'Descubre nuestros avances en medicamentos de última generación'
    },
    {
      id: 2,
      src: './assets/images/home2.jpg',
      title: 'Cuidado Integral',
      subtitle: 'Soluciones farmacéuticas para cada etapa de la vida'
    },
    {
      id: 3,
      src: './assets/images/home3.jpg',
      title: 'Compromiso con la Calidad',
      subtitle: 'Productos farmacéuticos con los más altos estándares'
    }
  ];
}