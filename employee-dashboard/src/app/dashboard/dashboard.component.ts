import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  employees = [];
  deletedEmployees = []
  columns = [
    { name: 'Name' },
    { name: 'Address' },
    { name: 'Company' },
    { name: 'Actions' }
  ]
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllEmployeesList();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.employees.filter(option => option.name.toLowerCase().includes(filterValue));
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
          item.id = null;
          this.employeeService.addEmployee(item).subscribe((response) => {
            if (response) {
              this.employees.push(response);
              this.employees = [...this.employees];
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
                  this.employees = [...this.employees];
                }
              });
            }

          });
        }

      });

  }
  deleteEmployee(emp) {
    this.employeeService.deleteEmployee(emp.id).subscribe((response) => {
      this.employees = [...this.employees];
    });
    this.deletedEmployees.push(emp);
    this.deletedEmployees = [...this.deletedEmployees];
  }

  restoreEmployee(emp) {
    this.employeeService.addEmployee(emp).subscribe((response) => {
      if (response) {
        this.employees.push(response);
        this.employees = [...this.employees];
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
      }
    });

  }
}

