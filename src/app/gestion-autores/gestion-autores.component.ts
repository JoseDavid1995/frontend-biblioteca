import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AutorService } from '../servicios/autor.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../loading.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-gestion-autores',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule, HttpClientModule, ReactiveFormsModule, ModalComponent ],
  providers: [AutorService, DatePipe], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './gestion-autores.component.html',
  styleUrl: './gestion-autores.component.css'
})
export class GestionAutoresComponent implements OnInit {
    @ViewChild(ModalComponent) modal!: ModalComponent; // Create a reference
  
  displayedColumns: string[] = ['id', 'fechaNacimiento', 'author', 'nacionalidad', 'acciones'];
  dataSource:any = [];

  searchTerm: string = '';
  paginatedData: any[] = [];
  currentSort: { key: string, direction: 'asc' | 'desc' } = { key: '', direction: 'asc' };
  currentPage: number = 1;
  pageSize: number = 10; // Cambia esto para ajustar el número de libros por página
  nacionalidades: any[] = [];
  estado: any[] = [];
  autorForm: FormGroup;
  descripcionNacionalidad: string = '';
  hayRegistros: boolean = true; // Inicialmente supongamos que hay registros
  selectedAutorId: number = 0;

  

  constructor(private router: Router,  private autorService: AutorService, private datePipe: DatePipe, private cdRef: ChangeDetectorRef,  private fb: FormBuilder,  private toastr: ToastrService, private loadingService: LoadingService) {
    this.autorForm = this.fb.group({
      nombre: [''],
      fechaNacimiento: [''],
      nacionalidad: ['0'],
      estado:  ['0'],
    });
   
  }

  ngOnInit(): void {

    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.loadingService.setLoading(false);
      this.obtenerNacionalidades();
      this.obtenerEstado();
      }, 2000);

    

  }

  sortData(key: string) {
    const direction = this.currentSort.key === key && this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    this.currentSort = { key, direction };

    this.paginatedData.sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(key: string) {
    if (this.currentSort.key !== key) return '';
    return this.currentSort.direction === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }

  updatePaginatedData() {
    const filteredData = this.dataSource.filter((book: any) => 
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) // Cambié book.title a book.author
    );
  
    this.totalPageCount = Math.ceil(filteredData.length / this.pageSize); // Actualizar totalPageCount
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = filteredData.slice(startIndex, startIndex + this.pageSize);
    
 
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPageCount) return;
    this.currentPage = page;
    this.updatePaginatedData();
  }

  totalPageCount: number = Math.ceil(this.dataSource.length / this.pageSize);

  totalPages() {
    return Array.from({ length: this.totalPageCount }, (_, i) => i + 1);
  }

  clearSearch() {
    this.searchTerm = '';
    this.autorForm.reset();
    this.obtenerAutores();
    this.updatePaginatedData();
    this.hayRegistros = true;
  }

  goRegisterAutores() {
    this.router.navigate(['/register-gestion-autores']);
  }

  ngOnChanges() {
    this.updatePaginatedData();
  }

  private obtenerAutores() {
    this.autorService.obtener().subscribe((result:any) => {
      console.log("autores", result)

      let data:any[] = [];
      
      

      result.data.forEach((element:any) => {

        this.nacionalidades.forEach(element2 => {
          if (element2.id === +element.nacionalidad ) {
            this.descripcionNacionalidad = element2.nombreNacionalidad
          }
          

        });

        let param:any = {
          id: element.id,
          nacionalidad:this.descripcionNacionalidad,
          author: element.nombre,
          fechaNacimiento: element.fechaNacimiento ,
          estado: element.estado === "A" ? "Activo" : "Inactivo"
        }

        data.push(param);


      });

      this.dataSource = data;
      this.currentPage = 1;
      this.updatePaginatedData();

      
      
      console.log("dataSource",this.dataSource)
      this.cdRef.detectChanges();

    }, (err:any) => {
      console.error(err);
    });
  }

  private obtenerNacionalidades() {
    this.autorService.obtenerNacionalidades().subscribe((result:any) => {
      console.log("nacionalidades", result)
      this.nacionalidades = result.data;
      this.obtenerAutores();

    }, (err:any) => {
      console.error(err);
    });
  }

  private obtenerEstado() {
    this.autorService.obtenerEstado().subscribe((result:any) => {
      console.log("estado", result)
      this.estado = result.data;
    }, (err:any) => {
      console.error(err);
    });
  }

   buscar() {

     let  nombre = this.autorForm.value.nombre ? this.autorForm.value.nombre : null;
     let fechaNacimiento: any = this.autorForm.value.fechaNacimiento ? this.formatDate(this.addOneDay(new Date(this.autorForm.value.fechaNacimiento)))  : null;
     let nacionalidad = this.autorForm.value.nacionalidad != "0" ? this.autorForm.value.nacionalidad : null;
     let estado = this.autorForm.value.estado ? this.autorForm.value.estado : null

    this.autorService.buscarAutor(nombre, fechaNacimiento, nacionalidad, estado).subscribe((result:any) => {
      let data:any[] = [];

      result.forEach((element:any) => {
        this.nacionalidades.forEach(element2 => {
          if (element2.id === +element.nacionalidad ) {
            this.descripcionNacionalidad = element2.nombreNacionalidad
          }
          

        });
        let param:any = {
          id: element.id,
          nacionalidad: this.descripcionNacionalidad,
          author: element.nombre,
          fechaNacimiento: element.fechaNacimiento,  
          estado: element.estado === "A" ? "Activo" : "Inactivo"
        }

        data.push(param);

      });

      this.dataSource = data;
      this.currentPage = 1;
      this.updatePaginatedData();

      if (this.dataSource.length === 0) {
        this.hayRegistros =false;
        
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

editar(id: number) {
  this.router.navigate(['/editar-gestion-autores', id]);
}

ver(id: number) {
  this.router.navigate(['/ver-gestion-autores', id]);
}

eliminar(id: number) {
  this.autorService.eliminar(id).subscribe((result:any) => {
    if (result.code === 1) {
      this.toastr.success("Se eliminó existosamente");
      this.obtenerAutores();
      
    }

  }, (err:any) => {
    console.error(err);
  });

}

openModal(id: number) {
  this.selectedAutorId = id;
  this.modal.openModal();
}

deleteRecord(id: number) {
  this.eliminar(id)  
  console.log('Registro eliminado');
  }
 
}
