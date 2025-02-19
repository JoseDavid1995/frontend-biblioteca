import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AutorService } from '../../servicios/autor.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-gestion-autores',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule,ReactiveFormsModule, HttpClientModule ],
  providers: [AutorService], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './registro-gestion-autores.component.html',
  styleUrl: './registro-gestion-autores.component.css'
})
export class RegistroGestionAutoresComponent implements OnInit{

  autorForm: FormGroup;
  nacionalidades: any[] = [];
  validations: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private autorService: AutorService, private toastr: ToastrService) {
    this.autorForm = this.fb.group({
      nombre: [''],
      fechaNacimiento: [''],
      nacionalidad: ['0']
    });
   
  }

  ngOnInit(): void {
   this.obtenerNacionalidades();

  }

  save(){
    console.log(this.autorForm.value);

  }

   goListAutores(){
    this.router.navigate(['/gestion-autores']);
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

   registrarAutor() {

    let param:any = {
      nombre: this.autorForm.value.nombre,
      fechaNacimiento: this.formatDate(this.addOneDay(new Date(this.autorForm.value.fechaNacimiento))),
      nacionalidad: this.autorForm.value.nacionalidad
    }
    this.autorService.registrar(param).subscribe((result:any) => {
      if (result.code === 1) {
        this.validations = true;
        this.toastr.success("Registro Existoso");
      }
    }, (err:any) => {
      console.error(err);
    });
  }

  private obtenerNacionalidades() {
    this.autorService.obtenerNacionalidades().subscribe((result:any) => {
      console.log("nacionalidades", result)
      this.nacionalidades = result.data;
    }, (err:any) => {
      console.error(err);
    });
  }
}
