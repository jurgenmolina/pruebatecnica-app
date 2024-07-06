import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from '../../../services/producto/producto.service';
import { Producto } from '../../../model/producto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogConfirmComponent } from '../../../components/dialog-confirm/dialog-confirm.component';
import { ProductoFormComponent } from '../producto-form/producto-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto',
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
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'nombre', 'descripcion', 'estado', 'nombreLaboratorio', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();
  totalProductos: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productoService: ProductoService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProductos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProductos(): void {
    this.productoService.getAllProductos().subscribe(
      data => {
        this.dataSource.data = data;
        this.totalProductos = data.length;
      },
      error => console.error(error)
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(producto?: Producto): void {
    const dialogRef = this.dialog.open(ProductoFormComponent, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      data: { producto: producto || {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductos();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProducto(id);
      }
    });
  }

  deleteProducto(id: number): void {
    this.productoService.deleteProducto(id).subscribe(
      () => this.loadProductos(),
      error => console.error(error)
    );
  }
}