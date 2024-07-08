import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterRequest } from '../../model/registerRequest';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { NgIf, CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogWelcomeComponent } from '../../components/dialog-welcome/dialog-welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    NgIf,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerError: string = "";
  registerForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    nombre: ['', [Validators.required]],
    tipoDocumento: ['', [Validators.required]],
    documento: ['', [Validators.required]],
    telefono: ['', [Validators.required]]
  });

  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.registerCustomIcons();
  }

  ngOnInit(): void {
    if (this.authService.currentUserLoginOn.value) {
      this.router.navigate(['home']);
    }
  }

  private registerCustomIcons() {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/google.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'facebook',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/facebook.svg')
    );
  }

  register() {
    if (this.registerForm.valid) {
      this.registerError = "";
      this.authService.register(this.registerForm.value as RegisterRequest).subscribe({
        next: () => {
          this.showWelcomeDialog();
          this.router.navigate(['/home']);
          this.registerForm.reset();
        },
        error: (errorData) => {
          console.error('Error al registrar:', errorData);
          this.registerError = errorData.message;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  private showWelcomeDialog(): void {
    const dialogRef = this.dialog.open(DialogWelcomeComponent, {
      data: { message: 'Registro exitoso, ¡Bienvenido!' },
      disableClose: true
    });

    setTimeout(() => {
      dialogRef.close();
    }, 1000);
  }
}