import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrestamoService } from '../../servicios/prestamo.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { LibroService } from '../../servicios/libro.service';

@Component({
  selector: 'app-registro-gestion-prestamos',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule, HttpClientModule, ReactiveFormsModule ],
  providers: [DatePipe, PrestamoService, LibroService], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './registro-gestion-prestamos.component.html',
  styleUrl: './registro-gestion-prestamos.component.css'
})
export class RegistroGestionPrestamosComponent implements OnInit {

    prestamoForm: FormGroup;
    validations: boolean = false;
    libros: any[] = [];
  constructor(private router: Router, private fb: FormBuilder, private prestamoService : PrestamoService, private toastr: ToastrService, private libroService: LibroService) {

    this.prestamoForm = this.fb.group({
      nombreLibro: ['0'],
      fechaPrestamo: [''],
      fechaDevolucion: [''],
    });
  }

  ngOnInit(): void {
      this.obtenerLibros();
  }

  goListPrestamo(){
      this.router.navigate(['/gestion-prestamos']);
    
  }

  registrar() {

    let param:any = {
      idLibro: +this.prestamoForm.value.nombreLibro,
      fechaPrestamo: this.formatDate(this.addOneDay(new Date(this.prestamoForm.value.fechaPrestamo))),
      fechaDevolucion: this.formatDate(this.addOneDay(new Date(this.prestamoForm.value.fechaDevolucion))),
    }
    this.prestamoService.registrar(param).subscribe((result:any) => {
      if (result.code === 1) {
        this.validations = true;
        this.toastr.success("Registro Existoso");
      }
    }, (err:any) => {
      console.error(err);
    });
  }

  addOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }
  
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private obtenerLibros() {
    this.libroService.obtener().subscribe((result:any) => {
        console.log("registro", result.data)
      this.libros = result.data;

    }, (err:any) => {
      console.error(err);
    });
  }

}
