import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { Proveedor } from '../../../model/proveedor';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DialogConfirmComponent } from '../../../components/dialog-confirm/dialog-confirm.component';
import { ProveedorFormComponent } from '../proveedor-form/proveedor-form.component';
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
  selector: 'app-proveedor',
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
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  displayedColumns: string[] = ['tipoIdentificacion', 'identificacion', 'razonSocial', 'direccion', 'nombreContacto', 'celularContacto', 'acciones'];
  dataSource = new MatTableDataSource<Proveedor>();
  totalProveedores: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private proveedorService: ProveedorService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProveedores();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProveedores(): void {
    this.proveedorService.getAllProveedores().subscribe(
      data => {
        this.dataSource.data = data;
        this.totalProveedores = data.length;
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

  openDialog(proveedor?: Proveedor): void {
    const dialogRef = this.dialog.open(ProveedorFormComponent, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      data: { proveedor: proveedor || {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProveedores();
      }
    });
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProveedor(id);
      }
    });
  }

  deleteProveedor(id: number): void {
    this.proveedorService.deleteProveedor(id).subscribe(
      () => this.loadProveedores(),
      error => console.error(error)
    );
  }
}