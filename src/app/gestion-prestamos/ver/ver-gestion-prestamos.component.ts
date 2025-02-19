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
  selector: 'app-ver-gestion-prestamos',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule, HttpClientModule, ReactiveFormsModule ],
  providers: [AutorService, PrestamoService, DatePipe, LibroService], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './ver-gestion-prestamos.component.html',
  styleUrl: './ver-gestion-prestamos.component.css'
})
export class VerGestionPrestamosComponent implements OnInit {
  autores:any[] = [];
  prestamoForm: FormGroup;
  isbn: string = ''; 
  uniqueIdentifier: number = 1; // Iniciar desde 1
  validations: boolean = false;
  id: number = 0;
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
      this.prestamoForm.disable();
        }, 2000);
    
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
 
  convertDateFormat(originalDate: string): string {
    const parts = originalDate.split("/"); // Split the date into parts
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Rearrange to YYYY-MM-DD
  }

  goListPrestamo(){
    this.router.navigate(['/gestion-prestamos']);
  
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
