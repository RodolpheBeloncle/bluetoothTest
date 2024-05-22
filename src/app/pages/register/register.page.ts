import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  credentials: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) { }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async signUp() {
    const loading = await this.createLoading();
    try {
      console.log('Form Values:', this.credentials.value); // Log form values
      const response = await firstValueFrom(this.authService.signUp(this.credentials.value));
      console.log('Server Response:', response); // Log server response
      if (response && response.error) {
        this.showAlert('Failed', response.error);
      } else {
        this.router.navigateByUrl('/groups', { replaceUrl: true });
        this.showAlert('Success', 'You have successfully registered.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error); // Log error
      this.showAlert('Failed', 'An error occurred while registering. Please try again.');
    } finally {
      loading.dismiss();
    }
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async createLoading() {
    const loading = await this.loadingController.create();
    await loading.present();
    return loading;
  }
}
