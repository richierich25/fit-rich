import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UiService } from '../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  // signupForm: FormGroup;
  @ViewChild('form', {static: true}) signupFormTD: NgForm;
  maxDate;
  isLoading = false;
  loadingSub: Subscription;

  constructor(private authService: AuthService, private uiService: UiService) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(status => this.isLoading = status);
  }

  onSubmitTD(): void {
    console.log(this.signupFormTD);
    this.authService.registerUser({
      email: this.signupFormTD.value.email,
      password: this.signupFormTD.value.password
    });
  }
  getEmailErrorMessageTD(): string {
    if (this.signupFormTD.form.controls.email.errors.required) {
      return 'You must enter a value';
    }
    return this.signupFormTD.form.controls.email.errors.email ? 'Not a valid email' : '';
  }
  ngOnDestroy(): void {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }

}

