import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RecepcionProductoService } from '../../../services/recepcion/recepcion.service';
import { RecepcionProducto } from '../../../model/recepcionProducto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto/producto.service';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { DialogConfirmComponent } from '../../../components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-recepcion-form',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './recepcion-form.component.html',
  styleUrl: './recepcion-form.component.css'
})
export class RecepcionFormComponent {
  recepcionForm: FormGroup;
  isEditMode: boolean;
  productoNoEncontrado: boolean = false;
  proveedorNoEncontrado: boolean = false;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<RecepcionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { recepcion: RecepcionProducto },
    private formBuilder: FormBuilder,
    private recepcionProductoService: RecepcionProductoService,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private dialog: MatDialog
  ) {
    this.isEditMode = !!data.recepcion.id;

    this.recepcionForm = this.formBuilder.group({
      id: [{ value: data.recepcion.id || '', disabled: true }],
      fechaHoraRecepcion: [data.recepcion.fechaHoraRecepcion || new Date(), Validators.required],
      codigoProducto: [data.recepcion.producto?.codigo || '', Validators.required],
      identificacionProveedor: [data.recepcion.proveedor?.identificacion || '', Validators.required],
      numeroFactura: [data.recepcion.numeroFactura || '', [Validators.required, Validators.maxLength(50)]],
      cantidad: [data.recepcion.cantidad || '', [Validators.required, Validators.min(1)]],
      lote: [data.recepcion.lote || '', [Validators.required, Validators.maxLength(50)]],
      registroInvima: [data.recepcion.registroInvima || '', [Validators.required, Validators.maxLength(50)]],
      fechaVencimiento: [data.recepcion.fechaVencimiento || '', Validators.required],
      estadoPresentacion: [data.recepcion.estadoPresentacion || '', [Validators.required, Validators.maxLength(200)]],
    });
  }

  loadProductoYProveedor(): void {
    this.productoService.getProducto(this.data.recepcion.producto.id).subscribe(
      producto => {
        this.recepcionForm.patchValue({ codigoProducto: producto.codigo });
      },
      error => console.error('Error al cargar producto:', error)
    );

    this.proveedorService.getProveedor(this.data.recepcion.proveedor.id).subscribe(
      proveedor => {
        this.recepcionForm.patchValue({ identificacionProveedor: proveedor.identificacion });
      },
      error => console.error('Error al cargar proveedor:', error)
    );
  }

  onlyNumbers(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.recepcionForm.valid) {
      const formData = this.recepcionForm.value;
      this.productoNoEncontrado = false;
      this.proveedorNoEncontrado = false;
      formData.numeroFactura = this.toUpperCase(formData.numeroFactura);
      formData.lote = this.toUpperCase(formData.lote);
      formData.registroInvima = this.toUpperCase(formData.registroInvima);
      formData.estadoPresentacion = this.toUpperCase(formData.estadoPresentacion);
  
      this.productoService.getProductoByCodigo(formData.codigoProducto).subscribe(
        producto => {
          if (producto) {
            formData.producto = producto.id;
  
            this.proveedorService.getProveedorPorIdentificacion(formData.identificacionProveedor).subscribe(
              proveedor => {
                if (proveedor) {
                  formData.proveedor = proveedor.id;
                  this.saveOrUpdateRecepcion(formData);
                } else {
                  this.proveedorNoEncontrado = true;
                }
              },
              error => {
                console.error('Error al obtener proveedor:', error);
                this.proveedorNoEncontrado = true;
              }
            );
          } else {
            this.productoNoEncontrado = true;
          }
        },
        error => {
          console.error('Error al obtener producto:', error);
          this.productoNoEncontrado = true;
        }
      );
    }
  }

  saveOrUpdateRecepcion(formData: any): void {
    // Eliminar campos que no son parte del modelo RecepcionProducto
    delete formData.codigoProducto;
    delete formData.identificacionProveedor;

    const recepcion: RecepcionProducto = {
      ...formData,
      id: this.isEditMode ? this.data.recepcion.id : undefined
    };

    if (this.isEditMode) {
      this.recepcionProductoService.updateRecepcion(this.data.recepcion.id!, recepcion).subscribe(
        () => {
          this.showConfirmDialog('ACTUALIZADO CON ÉXITO');
          this.dialogRef.close(true);
        },
        error => {
          console.error(error);
          this.errorMessage = 'Error al actualizar la recepción. El número de la factura podría estar duplicado.';
        }
      );
    } else {
      this.recepcionProductoService.createRecepcion(recepcion).subscribe(
        () => {
          this.showConfirmDialog('GUARDADO CON ÉXITO');
          this.dialogRef.close(true);
        },
        error => {
          console.error(error);
          this.errorMessage = 'Error al crear la recepción. El número de la factura podría estar duplicado.';
        }
      );
    }
  }

  private showConfirmDialog(message: string): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { message: message },
      disableClose: true
    });

    setTimeout(() => {
      dialogRef.close();
    }, 1000);
  }

  private toUpperCase(value: string): string {
    return value ? value.toUpperCase() : '';
  }
}
