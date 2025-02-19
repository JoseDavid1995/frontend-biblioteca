import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorService } from '../../servicios/autor.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../loading.service';

@Component({
  selector: 'app-ver-gestion-autores',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule,ReactiveFormsModule, HttpClientModule ],
  providers: [AutorService], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './ver-gestion-autores.component.html',
  styleUrl: './ver-gestion-autores.component.css'
})
export class VerGestionAutoresComponent implements OnInit{

  autorForm: FormGroup;
  nacionalidades: any[] = [];
  validations: boolean = false;
  id: number = 0;

  constructor(private router: Router, private fb: FormBuilder, private autorService: AutorService, private toastr: ToastrService, private route: ActivatedRoute, private loadingService: LoadingService) {
    this.autorForm = this.fb.group({
      nombre: [''],
      fechaNacimiento: [''],
      nacionalidad: ['0']
    });

   this.route.params.subscribe(params => {
      this.id = +params['id']; // Captura el ID de la ruta
  });
   
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.loadingService.setLoading(false);
      this.obtenerDataAutor(this.id); // Llama a una función para cargar los datos
   this.obtenerNacionalidades();
   this.autorForm.disable();
      }, 2000);
 

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

  private obtenerNacionalidades() {
    this.autorService.obtenerNacionalidades().subscribe((result:any) => {
      console.log("nacionalidades", result)
      this.nacionalidades = result.data;
    }, (err:any) => {
      console.error(err);
    });
  }

  convertDateFormat(originalDate: string): string {
    const parts = originalDate.split("/"); // Split the date into parts
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Rearrange to YYYY-MM-DD
}

  private obtenerDataAutor(id: any) {
    this.autorService.obtenerDataAutor(id).subscribe((result:any) => {
      console.log("autor", result)
      if (result.code === 1) {
        this.autorForm.controls['nombre'].setValue(result.data.nombre);
        this.autorForm.controls['fechaNacimiento'].setValue(this.convertDateFormat(result.data.fechaNacimiento));
        this.autorForm.controls['nacionalidad'].setValue(result.data.nacionalidad);

      }
    }, (err:any) => {
      console.error(err);
    });
  }
}
