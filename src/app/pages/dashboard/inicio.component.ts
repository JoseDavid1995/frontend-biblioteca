import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthInterceptorService } from '../../auth.interceptor';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { LoadingService } from '../../loading.service';
@Component({
  selector: 'app-inicio-cambio',
  standalone: true,
  imports: [

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  providers:[ToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true

    },
  ]
})
export class InicioComponent implements OnInit{


  lista = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'monedaOrigen', 'montoOrigen', 'monedaDestino', 'montoDestino'];
  usuario :any = {} ;
  showDropdown = false;


  constructor(private router: Router, public dialog: MatDialog, private toastr: ToastrService, private loadingService: LoadingService ) {
  }


  ngOnInit(): void {
    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.loadingService.setLoading(false);
    }, 2000);
  }

  irAGestionLibros() {
    this.router.navigate(['/gestion-libros']);
  }

  irAGestionAutores() {
    this.router.navigate(['/gestion-autores']);
  }


  irAGestionPrestamos() {
    this.router.navigate(['/gestion-prestamos']);
  }
  

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

}
