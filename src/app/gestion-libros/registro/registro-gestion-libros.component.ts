import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AutorService } from '../../servicios/autor.service';
import { LibroService } from '../../servicios/libro.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-gestion-libros',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule, HttpClientModule, ReactiveFormsModule ],
  providers: [AutorService, LibroService, DatePipe], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './registro-gestion-libros.component.html',
  styleUrl: './registro-gestion-libros.component.css'
})
export class RegistroGestionLibrosComponent implements OnInit {
  autores:any[] = [];
  libroForm: FormGroup;
  isbn: string = ''; 
  uniqueIdentifier: number = 1; // Iniciar desde 1
  validations: boolean = false;


  constructor(private router: Router, private autorService: AutorService, private fb: FormBuilder, private libroService:LibroService, private toastr: ToastrService) {
    this.libroForm = this.fb.group({
      nombreLibro: [''],
      fechaPublicacion: [''],
      isbn: [''],
      autor: ['0'],
    });
   
  }

  ngOnInit(): void {
      this.obtenerAutores();
      this.getFormattedIdentifier();
      //this.libroForm.controls['isbn'].disable();
     console.log("libroForm",this.libroForm); 
  }
  goListBooks(){
    this.router.navigate(['/gestion-libros']);
  }

  private obtenerAutores() {
    this.autorService.obtener().subscribe((result:any) => {
      console.log("autores", result)
      this.autores = result.data

    }, (err:any) => {
      console.error(err);
    });
  }

  generateUniqueIdentifier() {
    this.uniqueIdentifier += 1;
  }

  private getFormattedIdentifier() {
    this.libroForm.controls['isbn'].setValue(this.uniqueIdentifier.toString().padStart(6, '0'));

  }

  registrarLibro() {

    let param:any = {
      titulo: this.libroForm.value.nombreLibro,
      idAutor: +this.libroForm.value.autor,
      isbn: this.libroForm.value.isbn,
      fechaPublicacion: this.formatDate(this.addOneDay(new Date(this.libroForm.value.fechaPublicacion))),
    }
    this.libroService.registrar(param).subscribe((result:any) => {
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
  
}
