import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { EditEmployeeComponent } from './dashboard/edit-employee/edit-employee.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { EmployeeData } from './models/employee-data';
import {MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatSnackBarModule} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EditEmployeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(EmployeeData)
  ],
  entryComponents:[EditEmployeeComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
