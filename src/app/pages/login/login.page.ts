import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
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
  ) {
    this.redirectIfLoggedIn();
  }

  async redirectIfLoggedIn() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.router.navigateByUrl('/groups', { replaceUrl: true });
      }
    });
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async login() {
    const loading = await this.createLoading();
    try {
      // Convert the observable to a promise
      const response = await firstValueFrom(this.authService.signIn(this.credentials.value));
      if (response && response.error) {
        this.showAlert('Failed', response.error);
      } else {
        this.router.navigateByUrl('/groups', { replaceUrl: true });
        this.showAlert('Success', 'You have successfully logged in.');
      }
    } catch (error) {
      this.showAlert('Failed', 'An error occurred while logging in. Please try again.');
    } finally {
      loading.dismiss();
    }
  }


  async forgotPw() {
    const email = await this.promptForEmail('Receive a new password', 'Please insert your email');
    if (!email) return;

    const loading = await this.createLoading();
    try {
      const response = this.authService.forgotPassword(email).subscribe();
      if ((response as any) && (response as any).error) {
        this.showAlert('Failed', (response as any).error);
      } else {
        this.showAlert('Success', 'Please check your emails for further instructions!');
      }
    } catch (error) {
      this.showAlert('Failed', 'An error occurred while sending the password reset email. Please try again.');
    } finally {
      loading.dismiss();
    }
  }



  async promptForEmail(header: string, message: string): Promise<string | null> {
    const alert = await this.alertController.create({
      header,
      message,
      inputs: [{ type: 'email', name: 'email' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Submit', handler: (data) => data.email },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.data?.values?.email || null;
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToRegister() {
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }

  async createLoading() {
    const loading = await this.loadingController.create();
    await loading.present();
    return loading;
  }

}
