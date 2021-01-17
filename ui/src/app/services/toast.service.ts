import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar: MatSnackBar) { }

  error(message: string) {
    this.showSnackbar(message, 'error-toast');
  }

  warn(message: string) {
    this.showSnackbar(message, 'warn-toast');
  }

  info(message: string) {
    this.showSnackbar(message, 'info-toast');
  }

  private showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, null, {
      duration: 5000,
      panelClass,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
