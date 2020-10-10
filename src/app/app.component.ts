import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.initAuthListener();
    // initialize the authentication listener to resppond to any change in the user authentication status
  }
  ngOnDestroy(): void {
    this.authService.cancelFirestoreAuthSub();
  }
}
