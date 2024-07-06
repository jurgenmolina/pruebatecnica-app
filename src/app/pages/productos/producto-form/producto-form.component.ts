import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '../../../model/producto';
import { ProductoService } from '../../../services/producto/producto.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent {
  productoForm: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<ProductoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { producto: Producto },
    private formBuilder: FormBuilder,
    private productoService: ProductoService
  ) {
    this.isEditMode = !!data.producto.id;

    this.productoForm = this.formBuilder.group({
      id: [{ value: data.producto.id || '', disabled: true }],
      codigo: [data.producto.codigo || '', [Validators.required, Validators.maxLength(20)]],
      nombre: [data.producto.nombre || '', [Validators.required, Validators.maxLength(100)]],
      descripcion: [data.producto.descripcion || '', [Validators.required, Validators.maxLength(200)]],
      estado: [data.producto.estado || '', [Validators.required]],
      nombreLaboratorio: [data.producto.nombreLaboratorio || '', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      const productoRaw: Producto = this.productoForm.getRawValue();
      
      // Convertir todos los campos de texto a mayúsculas
      const producto: Producto = {
        ...productoRaw,
        codigo: this.toUpperCase(productoRaw.codigo),
        nombre: this.toUpperCase(productoRaw.nombre),
        descripcion: this.toUpperCase(productoRaw.descripcion),
        estado: this.toUpperCase(productoRaw.estado),
        nombreLaboratorio: this.toUpperCase(productoRaw.nombreLaboratorio)
      };

      if (this.isEditMode) {
        this.productoService.updateProducto(producto.id!, producto).subscribe(
          () => this.dialogRef.close(true),
          error => console.error(error)
        );
      } else {
        this.productoService.createProducto(producto).subscribe(
          () => this.dialogRef.close(true),
          error => console.error(error)
        );
      }
    }
  }

  // Método auxiliar para convertir a mayúsculas
  private toUpperCase(value: string): string {
    return value ? value.toUpperCase() : '';
  }
}