import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgModule } from '@angular/core';

import { AppComponent } from "./app.component";
import { AuthenticationComponent } from "./auth/authentication.component";
import { AuthService } from "./auth/auth.service";
import { ErrorComponent } from "./errors/error.component";
import { ErrorService } from "./errors/error.service";
import { HeaderComponent } from "./header.component";
import { MessageModule } from "./messages/message.module";
import { routing } from "./app.routing";

@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        ErrorComponent,
        HeaderComponent
    ],
    imports: [
      BrowserModule,
      HttpModule,
      MessageModule,
      routing
    ],
    providers: [
      AuthService,
      ErrorService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
