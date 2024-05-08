import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./pages/groups/groups.module').then((m) => m.GroupsPageModule),
  },
  {
    path: 'groups/:groupid',
    loadChildren: () =>
      import('./pages/messages/messages.module').then((m) => m.MessagesPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
