import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Proveedor } from '../../../model/proveedor';
import { ProveedorService } from '../../../services/proveedor/proveedor.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogConfirmComponent } from '../../../components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.css']
})
export class ProveedorFormComponent {
  proveedorForm: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<ProveedorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { proveedor: Proveedor },
    private formBuilder: FormBuilder,
    private proveedorService: ProveedorService,
    private dialog: MatDialog
  ) {
    this.isEditMode = !!data.proveedor.id;

    this.proveedorForm = this.formBuilder.group({
      id: [{ value: data.proveedor.id || '', disabled: true }],
      tipoIdentificacion: [data.proveedor.tipoIdentificacion || '', [Validators.required, Validators.pattern('^(CEDULA DE CIUDADANIA|NIT|CEDULA DE EXTRANJERIA)$')]],
      identificacion: [data.proveedor.identificacion || '', [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]*$')]],
      razonSocial: [data.proveedor.razonSocial || '', [Validators.required, Validators.maxLength(100)]],
      direccion: [data.proveedor.direccion || '', [Validators.required, Validators.maxLength(200)]],
      nombreContacto: [data.proveedor.nombreContacto || '', [Validators.required, Validators.maxLength(100)]],
      celularContacto: [data.proveedor.celularContacto || '', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
    });
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
    if (this.proveedorForm.valid) {
      const proveedorRaw: Proveedor = this.proveedorForm.getRawValue();
      
      const proveedor: Proveedor = {
        ...proveedorRaw,
        tipoIdentificacion: this.toUpperCase(proveedorRaw.tipoIdentificacion),
        identificacion: this.toUpperCase(proveedorRaw.identificacion),
        razonSocial: this.toUpperCase(proveedorRaw.razonSocial),
        direccion: this.toUpperCase(proveedorRaw.direccion),
        nombreContacto: this.toUpperCase(proveedorRaw.nombreContacto),
        celularContacto: this.toUpperCase(proveedorRaw.celularContacto)
      };

      if (this.isEditMode) {
        this.proveedorService.updateProveedor(proveedor.id!, proveedor).subscribe(
          () => {
            this.showConfirmDialog('ACTUALIZADO CON ÉXITO');
            this.dialogRef.close(true);
          },
          error => console.error(error)
        );
      } else {
        this.proveedorService.createProveedor(proveedor).subscribe(
          () => {
            this.showConfirmDialog('GUARDADO CON ÉXITO');
            this.dialogRef.close(true);
          },
          error => console.error(error)
        );
      }
    }
  }

  private toUpperCase(value: string): string {
    return value ? value.toUpperCase() : '';
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
}