import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material.module';
import { WelcomeModule } from './welcome/welcome.module';
import { NavigationModule } from './navigation/navigation.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    // TrainingModule, // as lazy loading
    WelcomeModule,
    NavigationModule,
    FlexLayoutModule,
    MaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule, // can move it into training.module
    // AngularFireAuthModule, // can move to auth.module
    // eagerly loading the auth module but lazily loading the training module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
