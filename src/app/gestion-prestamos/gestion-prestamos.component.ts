import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingService } from '../loading.service';
import { PrestamoService } from '../servicios/prestamo.service';
import { AutorService } from '../servicios/autor.service';
import { HttpClientModule } from '@angular/common/http';
import { LibroService } from '../servicios/libro.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-gestion-prestamos',
  standalone: true,
  imports: [MatTableModule, FormsModule, MatInputModule, CommonModule, ReactiveFormsModule, HttpClientModule, ModalComponent ],
  providers: [AutorService, DatePipe, PrestamoService, LibroService], // Esto es opcional si utilizas providedIn: 'root'
  templateUrl: './gestion-prestamos.component.html',
  styleUrl: './gestion-prestamos.component.css'
})
export class GestionPrestamosComponent implements OnInit{
    @ViewChild(ModalComponent) modal!: ModalComponent; // Create a reference
  
  displayedColumns: string[] = ['id', 'title', 'author', 'year'];
  dataSource: any = [
  ];

  searchTerm: string = '';
  paginatedData: any[] = [];
  currentPage: number = 1;
  pageSize: number = 2; // Cambia esto para ajustar el número de libros por página
  prestamoForm: FormGroup;
  hayRegistros: boolean = true; // Inicialmente supongamos que hay registros
  libros: any[] = [];
  nombreLibro: string = "";
  currentSort: { key: string, direction: 'asc' | 'desc' } = { key: '', direction: 'asc' };
  selectedPrestamoId: number = 0;

  constructor(private router:Router,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private prestamoService: PrestamoService,
    private libroService: LibroService,
     private cdRef: ChangeDetectorRef,
     private toastr: ToastrService,
  ) {
    //this.updatePaginatedData();
    this.prestamoForm = this.fb.group({
      nombreLibro: ['0'],
      fechaPrestamo: [''],
      fechaDevolucion: [''],
    });
  }
  ngOnInit(): void {
    this.loadingService.setLoading(true);
    // Simular una carga
    setTimeout(() => {
      this.loadingService.setLoading(false);
      this.obtenerLibros();
        }, 2000);
  }

  updatePaginatedData() {
    const filteredData = this.dataSource.filter((book: any) => 
      book.libro.toLowerCase().includes(this.searchTerm.toLowerCase()) // Cambié book.title a book.author
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
    this.obtenerPrestamos();
    this.prestamoForm.reset();
    this.hayRegistros = true;
    this.updatePaginatedData();
  }

  goRegistroPrestamos() {
    this.router.navigate(['/registro-gestion-prestamos']);

}

  ngOnChanges() {
    this.updatePaginatedData();
  }

  private obtenerPrestamos() {
    this.prestamoService.obtener().subscribe((result:any) => {
      console.log("prestamo", result)

      let data:any[] = [];

      result.data.forEach((element:any) => {

        this.libros.forEach(element2 => {
          if (element2.id === +element.idLibro ) {
            this.nombreLibro = element2.titulo
          }
          

        });

        let param:any = {
          id: element.id,
          fechaDevolucion: element.fechaDevolucion,
          libro: this.nombreLibro,
          fechaPrestamo: element.fechaPrestamo ,
          estado: element.estado === 1 ? "Prestado" : "No Prestado"
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

  private obtenerLibros() {
    this.libroService.obtener().subscribe((result:any) => {

      this.libros = result.data;
      this.obtenerPrestamos();

    }, (err:any) => {
      console.error(err);
    });
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


  editar(id: number) {
    this.router.navigate(['/editar-gestion-prestamos', id]);
  }
  
  ver(id: number) {
    this.router.navigate(['/ver-gestion-prestamos', id]);
  }
  
  eliminar(id: number) {
    this.prestamoService.eliminar(id).subscribe((result:any) => {
      if (result.code === 1) {
        this.toastr.success("Se actualizó existosamente el préstamo del libro");
        this.obtenerPrestamos();
        
      }
  
    }, (err:any) => {
      console.error(err);
    });
  
  }

  openModal(id: number) {
    this.selectedPrestamoId = id;
    this.modal.openModal();
  }

  deleteRecord(id: number) {
    this.eliminar(id)  
    console.log('Registro eliminado');
    }


    buscar() {

      let  idLibro = this.prestamoForm.value.nombreLibro ? +this.prestamoForm.value.nombreLibro : null;
      let fechaPublicacion: any = this.prestamoForm.value.fechaPrestamo ? this.formatDate(this.addOneDay(new Date(this.prestamoForm.value.fechaPrestamo)))  : null;
      let fechaDevolucion: any = this.prestamoForm.value.fechaDevolucion ? this.formatDate(this.addOneDay(new Date(this.prestamoForm.value.fechaDevolucion)))  : null;


  
     this.prestamoService.buscarPrestamo(idLibro, fechaPublicacion, fechaDevolucion).subscribe((result:any) => {
       let data:any[] = [];
  
       result.forEach((element:any) => {
  
        this.libros.forEach(element2 => {
          if (element2.id === +element.idLibro ) {
            this.nombreLibro = element2.titulo
          }
          

        });

        let param:any = {
          id: element.id,
          fechaDevolucion: element.fechaDevolucion,
          libro: this.nombreLibro,
          fechaPrestamo: element.fechaPrestamo ,
          estado: element.estado === "1" ? "Devuelto" : "No Devuelto"
        }

        data.push(param);


      });

      this.dataSource = data;
      this.currentPage = 1;
      this.updatePaginatedData();

      
      
      console.log("dataSource",this.dataSource)
      this.cdRef.detectChanges();
  
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

 
}
