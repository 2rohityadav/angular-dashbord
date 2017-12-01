import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Used to create fake backend
import { fakeBackendProvider } from './_helpers/Index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashbordComponent } from './components/dashbord/dashbord.component';
import { RegisterComponent } from './register/register.component';

// routes
import { routing } from './app.routing';

// services
import { AuthenticationService, UserService } from './_services/index';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashbordComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
   AuthenticationService,
   UserService,

    // Providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
