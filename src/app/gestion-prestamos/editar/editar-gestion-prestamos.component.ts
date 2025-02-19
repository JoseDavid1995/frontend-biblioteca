import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorService } from '../../servicios/autor.service';
import { LibroService } from '../../servicios/libro.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../loading.service';
import { PrestamoService } from '../../servicios/prestamo.service';

@Component({
  selector: 'app-editar-gestion-prestamos',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule, HttpClientModule, ReactiveFormsModule ],
  providers: [PrestamoService, LibroService, DatePipe], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './editar-gestion-prestamos.component.html',
  styleUrl: './editar-gestion-prestamos.component.css'
})
export class EditarGestionPrestamosComponent implements OnInit {
  prestamoForm: FormGroup;
  id: number = 0;
  validations: boolean = false;
    libros: any[] = [];



  constructor(private router: Router, private prestamoService: PrestamoService, private fb: FormBuilder, private libroService:LibroService, private toastr: ToastrService, private route: ActivatedRoute, private loadingService: LoadingService) {
    this.prestamoForm = this.fb.group({
      nombreLibro: ['0'],
      fechaPrestamo: [''],
      fechaDevolucion: [''],
    });

    this.route.params.subscribe(params => {
      this.id = +params['id']; // Captura el ID de la ruta
  });
   
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.loadingService.setLoading(false);
      this.obtenerLibros();
      this.obtenerData();
  }, 2000);
  
  }

  goListPrestamo(){
    this.router.navigate(['/gestion-prestamos']);
  
}


obtenerData() {

  this.prestamoService.obtenerDataPrestamo(this.id).subscribe((result:any) => {
    this.prestamoForm.controls['nombreLibro'].setValue(result.data.idLibro);
    this.prestamoForm.controls['fechaPrestamo'].setValue(this.convertDateFormat(result.data.fechaPrestamo));
    this.prestamoForm.controls['fechaDevolucion'].setValue(this.convertDateFormat(result.data.fechaDevolucion));

  }, (err:any) => {
    console.error(err);
  });
}


actualizar() {

  let param:any = {
    idLibro: +this.prestamoForm.value.nombreLibro,
    fechaPrestamo: this.formatDate(this.addOneDay(new Date(this.prestamoForm.value.fechaPrestamo))),
    fechaDevolucion: this.formatDate(this.addOneDay(new Date(this.prestamoForm.value.fechaDevolucion))),
  }
  this.prestamoService.actualizar(this.id, param).subscribe((result:any) => {
    if (result.code === 1) {
      this.validations = true;
      this.toastr.success("Actualización Existosa");
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

convertDateFormat(originalDate: string): string {
  const parts = originalDate.split("/"); // Split the date into parts
  return `${parts[2]}-${parts[1]}-${parts[0]}`; // Rearrange to YYYY-MM-DD
}
}