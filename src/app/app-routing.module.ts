// import { NgModule } from '@angular/core';
// import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';

// const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full',
//   },
//   {
//     path: 'login',
//     loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
//   },
//   {
//     path: 'register',
//     loadChildren: () => import('./pages/register/register.module').then((m) => m.RegisterPageModule),
//   },
//   {
//     path: 'tabs',
//     loadChildren: () => import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'groups',
//     loadChildren: () => import('./pages/groups/groups.module').then((m) => m.GroupsPageModule),
//     canActivate: [AuthGuard],
//   },
//   {
//     path: 'groups/:groupid',
//     loadChildren: () => import('./pages/messages/messages.module').then((m) => m.MessagesPageModule),
//     canActivate: [AuthGuard],
//   },
//   {
//     path: '**',
//     redirectTo: 'login',
//     pathMatch: 'full',
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
//   exports: [RouterModule],
// })
// export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: '**',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
