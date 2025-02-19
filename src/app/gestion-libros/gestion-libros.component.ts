import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AutorService } from '../servicios/autor.service';
import { HttpClientModule } from '@angular/common/http';
import { LibroService } from '../servicios/libro.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../loading.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-gestion-libros',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule, HttpClientModule, ReactiveFormsModule, ModalComponent ],
  providers: [AutorService, DatePipe, LibroService], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './gestion-libros.component.html',
  styleUrl: './gestion-libros.component.css'
})
export class GestionLibrosComponent implements OnInit{
  @ViewChild(ModalComponent) modal!: ModalComponent; // Create a reference

  displayedColumns: string[] = ['id', 'title', 'author', 'year'];
  dataSource:any = [];

  searchTerm: string = '';
  paginatedData: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10; // Cambia esto para ajustar el número de libros por página
  autores: any[] = [];
  estado: any[] = [];
  libroForm: FormGroup;
  hayRegistros: boolean = true; // Inicialmente supongamos que hay registros
  nombreAutor: string = "";
  currentSort: { key: string, direction: 'asc' | 'desc' } = { key: '', direction: 'asc' };
  selectedBookId: number = 0;

  

  constructor(private router:Router, 
    private autorService: AutorService, 
    private fb: FormBuilder,
  private libroService: LibroService,
private cdRef: ChangeDetectorRef,
private toastr: ToastrService,
private loadingService: LoadingService) {

    this.libroForm = this.fb.group({
      titulo: [''],
      fechaPublicacion: [''],
      autor: ['0'],
      estado:  ['0'], 
    });
   

    //this.updatePaginatedData();
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    // Simular una carga
    setTimeout(() => {
      this.loadingService.setLoading(false);
      // Aquí puedes cargar los datos o la lógica que necesites
    }, 2000);
      this.obtenerAutores();
      this.obtenerEstado();
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
    this.libroForm.reset();
    this.obtenerAutores();
    this.hayRegistros = true;
    this.updatePaginatedData();
  }

  goRegisterBook() {
    this.router.navigate(['/registro-gestion-libros']);
  }

  ngOnChanges() {
    this.updatePaginatedData();
  }

  private obtenerAutores() {
    this.autorService.obtener().subscribe((result:any) => {
      console.log("autores", result)
      this.autores = result.data
      this.obtenerLibros();

    }, (err:any) => {
      console.error(err);
    });
  }

  private obtenerEstado() {
    this.libroService.obtenerEstado().subscribe((result:any) => {
      console.log("estado", result)
      this.estado = result.data;
    }, (err:any) => {
      console.error(err);
    });
  }

  private obtenerLibros() {
    this.libroService.obtener().subscribe((result:any) => {
      console.log("autores", result)

      let data:any[] = [];

      result.data.forEach((element:any) => {

        this.autores.forEach(element2 => {
          if (element2.id === +element.idAutor ) {
            this.nombreAutor = element2.nombre
          }
          

        });

        let param:any = {
          id: element.id,
          title: element.titulo,
          author: this.nombreAutor,
          fechaPublicacion: element.fechaPublicacion ,
          estado: element.estado === 1 ? "Disponible" : "No Disponible"
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

  getSortIcon(key: string) {
    if (this.currentSort.key !== key) return '';
    return this.currentSort.direction === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
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

  buscar() {

    let  titulo = this.libroForm.value.titulo ? this.libroForm.value.titulo : null;
    let fechaPublicacion: any = this.libroForm.value.fechaPublicacion ? this.formatDate(this.addOneDay(new Date(this.libroForm.value.fechaPublicacion)))  : null;
    let idAutor = this.libroForm.value.autor != "0" ? +this.libroForm.value.autor : null;
    let estado = this.libroForm.value.estado ? +this.libroForm.value.estado : null

   this.libroService.buscarLibro(titulo, fechaPublicacion, idAutor, estado).subscribe((result:any) => {
     let data:any[] = [];

     result.forEach((element:any) => {

      this.autores.forEach(element2 => {
        if (element2.id === +element.idAutor ) {
          this.nombreAutor = element2.nombre
        }
        

      });

      let param:any = {
        id: element.id,
        title: element.titulo,
        author: this.nombreAutor,
        fechaPublicacion: element.fechaPublicacion ,
        estado: element.estado === 1 ? "Disponible" : "No Disponible"
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
  this.router.navigate(['/editar-gestion-libros', id]);
}

ver(id: number) {
  this.router.navigate(['/ver-gestion-libros', id]);
}

eliminar(id: number) {
  this.libroService.eliminar(id).subscribe((result:any) => {
    if (result.code === 1) {
      this.toastr.success("Se eliminó existosamente");
      this.obtenerLibros();
      
    }

  }, (err:any) => {
    console.error(err);
  });

}

activar(id: number) {
  this.libroService.activar(id).subscribe((result:any) => {
    if (result.code === 1) {
      this.toastr.success("Se eliminó existosamente");
      this.obtenerLibros();
      
    }

  }, (err:any) => {
    console.error(err);
  });

}

openModal(id: number) {
  this.selectedBookId = id;
  this.modal.openModal();
}

deleteRecord(id: number) {
this.eliminar(id)  
console.log('Registro eliminado');
}

}


