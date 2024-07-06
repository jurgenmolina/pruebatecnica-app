import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-welcome',
  standalone: true,
  imports: [],
  templateUrl: './dialog-welcome.component.html',
  styleUrl: './dialog-welcome.component.css'
})
export class DialogWelcomeComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogWelcomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }
}