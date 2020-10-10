import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // boolean value of true means the spinner will be visible and the data is being loaded
  loadingStateChanged = new Subject<boolean>();

  constructor(private snackBar: MatSnackBar) { }

  showSnackBar(message, action, duration): void {
    this.snackBar.open(message, action, {
      duration
    });
  }
}
