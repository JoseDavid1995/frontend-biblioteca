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

@Component({
  selector: 'app-editar-gestion-libros',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule, HttpClientModule, ReactiveFormsModule ],
  providers: [AutorService, LibroService, DatePipe], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './editar-gestion-libros.component.html',
  styleUrl: './editar-gestion-libros.component.css'
})
export class EditarGestionLibrosComponent implements OnInit {
  autores:any[] = [];
  libroForm: FormGroup;
  isbn: string = ''; 
  uniqueIdentifier: number = 1; // Iniciar desde 1
  validations: boolean = false;
  id: number = 0;



  constructor(private router: Router, private autorService: AutorService, private fb: FormBuilder, private libroService:LibroService, private toastr: ToastrService, private route: ActivatedRoute, private loadingService: LoadingService) {
    this.libroForm = this.fb.group({
      nombreLibro: [''],
      fechaPublicacion: [''],
      isbn: [''],
      autor: ['0'],
    });

    this.route.params.subscribe(params => {
      this.id = +params['id']; // Captura el ID de la ruta
  });
   
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.loadingService.setLoading(false);
      this.obtenerAutores();
      this.getFormattedIdentifier();
      this.obtenerDataLibro(this.id);
        }, 2000);
     
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

  actualizarLibro() {

    let param:any = {
      titulo: this.libroForm.value.nombreLibro,
      idAutor: +this.libroForm.value.autor,
      isbn: this.libroForm.value.isbn,
      fechaPublicacion: this.formatDate(this.addOneDay(new Date(this.libroForm.value.fechaPublicacion))),
    }
    this.libroService.actualizar(this.id,param).subscribe((result:any) => {
      if (result.code === 1) {
        this.validations = true;
        this.toastr.success("Se actualizó Existosamente");
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

private obtenerDataLibro(id: any) {
  this.libroService.obtenerDataLibro(id).subscribe((result:any) => {
    console.log("autor", result)
    if (result.code === 1) {
      this.libroForm.controls['nombreLibro'].setValue(result.data.titulo);
      this.libroForm.controls['fechaPublicacion'].setValue(this.convertDateFormat(result.data.fechaPublicacion));
      this.libroForm.controls['autor'].setValue(result.data.idAutor);
      this.libroForm.controls['isbn'].setValue(result.data.isbn);


    }
  }, (err:any) => {
    console.error(err);
  });
}

convertDateFormat(originalDate: string): string {
  const parts = originalDate.split("/"); // Split the date into parts
  return `${parts[2]}-${parts[1]}-${parts[0]}`; // Rearrange to YYYY-MM-DD
}
  
}
