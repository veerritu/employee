import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../models/employee.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  employees = [];
  deletedEmployees = []
  stopIterartor = false;
  columns = [
    { name: 'Name' },
    { name: 'Address' },
    { name: 'Company' },
    { name: 'Actions' }
  ]
  nameControl = new FormControl();
  addressControl = new FormControl();
  companyControl = new FormControl();
  filteredNames: Observable<string[]>;
  filteredAddress: Observable<string[]>;
  filteredCompany: Observable<string[]>;
  nameArr = [];
  addArr = [];
  compArr = [];
  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getAllEmployeesList();
    this.filteredCompany = this.companyControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.compArr))
      );
    this.filteredNames = this.nameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value,
          this.nameArr))
      );
    this.filteredAddress = this.addressControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.addArr))
      );

    this.filteredNames.subscribe((data) => {
      if (data) {
        var i = 0;
        while (!this.stopIterartor && i < this.employees.length) {
          if (this.employees[i].name === this.nameControl.value) {
            // this.employees = [];
            this.employees = [this.employees[i]];
            this.employees = [...this.employees];
            this.stopIterartor = true;
            this.openSnackBar('Filtered value  -' + this.nameControl.value)
          } else {
            i++;
            this.getAllEmployeesList();
            this.employees = [...this.employees];
          }

        }

      }
    });
  }

  private _filter(value: string, arr: any): string[] {
    this.stopIterartor = false;
    const filterValue = value.toLowerCase();
    const val = arr.filter(option => option.toLowerCase().includes(filterValue));


    return val;
  }

  updateEmployee(emp) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '20vh',
      left: '30vw'
    };

    if (emp === 'add') {
      dialogConfig.data = {}
    } else {
      dialogConfig.data = {
        id: emp.id,
        name: emp.name,
        address: emp.address.street,
        company: emp.company.name
      }
    }

    this.dialog.open(EditEmployeeComponent, dialogConfig).afterClosed()
      .subscribe(item => {
        if (emp === 'add') {
          const data: Employee = {
            name: item.name,
            phone: '',
            address: {
              street: item.address,
              suite: '',
              city: '',
              geo: {
                lat: '',
                lng: ''
              },
              zipcode: ''
            },
            company: {
              name: item.company,
              bs: '',
              catchPhrase: ''
            },
            email: '',
            id: null,
            username: '',
            website: ''
          };
          this.employeeService.addEmployee(data).subscribe((response) => {
            if (response) {
              // this.employees.push(response);
              this.getAllEmployeesList();
              this.employees = [...this.employees];
              this.openSnackBar('Employee added successfully');
            }
          });
        } else {
          this.employees.forEach(element => {
            if (element.id === item.id) {
              element.name = item.name;
              element.address.street = item.address;
              element.company.name = item.company;
              this.employeeService.updateEmployee(item).subscribe((response) => {
                if (response) {
                  this.openSnackBar('Employee data updated successfully');
                }
              });
            }

          });
        }

      });

  }
  deleteEmployee(emp) {
    this.employeeService.deleteEmployee(emp.id).subscribe((response) => {
      this.getAllEmployeesList();
      this.employees = [...this.employees];
      this.openSnackBar('Employee deleted successfully');
    });
    this.deletedEmployees.push(emp);
    this.deletedEmployees = [...this.deletedEmployees];
  }

  restoreEmployee(emp) {
    this.employeeService.addEmployee(emp).subscribe((response) => {
      if (response) {
        this.getAllEmployeesList();
        this.employees = [...this.employees];
        this.openSnackBar('Employee restored successfully');
      }
    });
    for (let i = 0; i < this.deletedEmployees.length; i++) {
      if (emp.id === this.deletedEmployees[i].id) {
        this.deletedEmployees.splice(i, 1);
        this.deletedEmployees = [...this.deletedEmployees];
      }
    }
  }


  getAllEmployeesList() {
    this.employeeService.getAllEmployees().subscribe((response) => {
      if (response) {
        this.employees = response;
        this.employees.forEach(element => {
          this.addArr.push(element.address.street);
          this.nameArr.push(element.name);
          this.compArr.push(element.company.name);
        })
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}

