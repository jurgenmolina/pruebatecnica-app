import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-delete-confirm',
  standalone: true,
  imports: [MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CommonModule],
  templateUrl: './dialog-delete-confirm.component.html',
  styleUrl: './dialog-delete-confirm.component.css'
})
export class DialogDeleteConfirmComponent {
  constructor(public dialogRef: MatDialogRef<DialogDeleteConfirmComponent>) { }

  onDelete(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
