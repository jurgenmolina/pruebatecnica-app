import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecepcionProductoService } from '../../../services/recepcion/recepcion.service'; 
import { RecepcionProducto } from '../../../model/recepcionProducto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogDeleteConfirmComponent } from '../../../components/dialog-delete-confirm/dialog-delete-confirm.component';
import { RecepcionFormComponent } from '../recepcion-form/recepcion-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ProductoService } from '../../../services/producto/producto.service';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';

@Component({
  selector: 'app-recepcion',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css'],
  providers: [DatePipe]
})
export class RecepcionComponent implements OnInit {
  displayedColumns: string[] = ['fechaHoraRecepcion', 'producto', 'proveedor', 'numeroFactura', 'cantidad', 'lote', 'registroInvima', 'fechaVencimiento', 'estadoPresentacion', 'acciones'];
  dataSource = new MatTableDataSource<RecepcionProducto>();
  totalRecepciones: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private recepcionProductoService: RecepcionProductoService,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadRecepciones();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRecepciones(): void {
    this.recepcionProductoService.getAllRecepciones().subscribe(
      data => {
        this.dataSource.data = data;
        this.totalRecepciones = data.length;
      },
      error => console.error(error)
    );
  }

  loadProductosYProveedores(): void {
    this.dataSource.data.forEach(recepcion => {
      this.productoService.getProducto(recepcion.producto.id).subscribe(
        producto => {
          recepcion.codigoProducto = producto.codigo;
        },
        error => console.error('Error al cargar producto:', error)
      );

      this.proveedorService.getProveedor(recepcion.proveedor.id).subscribe(
        proveedor => {
          recepcion.identificacionProveedor = proveedor.identificacion;
        },
        error => console.error('Error al cargar proveedor:', error)
      );
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(recepcion?: RecepcionProducto): void {
    const dialogRef = this.dialog.open(RecepcionFormComponent, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      data: { recepcion: recepcion || {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRecepciones();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(DialogDeleteConfirmComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRecepcion(id);
      }
    });
  }

  deleteRecepcion(id: number): void {
    this.recepcionProductoService.deleteRecepcion(id).subscribe(
      () => this.loadRecepciones(),
      error => console.error(error)
    );
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }
}