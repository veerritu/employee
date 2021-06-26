import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeData } from 'src/app/models/employee-data';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {

  form: FormGroup;
  name:string;
  address: string;
  company : string;
  id : number;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<EditEmployeeComponent>,
      private employeeService: EmployeeService,
      @Inject(MAT_DIALOG_DATA) data) {

      this.name = data.name;
      this.address = data.address;
      this.company = data.company;
      this.id = data.id;
  }

  ngOnInit() {
      this.form = this.fb.group({
          name: [this.name, []],
          address: [this.address, []],
          company: [this.company, []]
      });
  }

  save() {
      this.form.value.id = this.id;
      this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }
}
