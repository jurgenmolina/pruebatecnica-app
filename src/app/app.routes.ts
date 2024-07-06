import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ProductoComponent } from './pages/productos/producto/producto.component';
import { ProveedorComponent } from './pages/proveedores/proveedor/proveedor.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'iniciar-sesion', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      { path: 'productos', component: ProductoComponent },
      { path: 'proveedores', component: ProveedorComponent },
      // Aquí puedes agregar más rutas protegidas en el futuro
    ]
  },
];