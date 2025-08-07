import { CurrencyPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PayrollEmployee } from '../models';
import { EmployeesStore } from '../stores/employees.store';
import { PayrollEmployeesFormComponent } from './payroll-employees-form.component';

/**
 * Component to manage payroll employees, providing functionalities to display,
 * edit, and delete employees within a payroll. Integrates with a backend
 * service to fetch and update employee payroll information.
 *
 * Features:
 * - Displays a table of employees with pagination and filtering options.
 * - Allows adding and editing employee payroll details through a modal form.
 * - Provides functionality to delete an employee with confirmation.
 * - Supports massive charge of active employees into the payroll.
 */
@Component({
  selector: 'pt-payroll-employees',
  imports: [TableModule, Button, CurrencyPipe, IconField, InputIcon, InputText],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-table
      #dt2
      [value]="employees.value() || []"
      [loading]="employees.isLoading()"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 25, 50]"
      [globalFilterFields]="['employee.first_name', 'employee.father_name']"
      [scrollable]="true"
      dataKey="id"
      stripedRows
      paginatorDropdownAppendTo="body"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} empleados"
    >
      <ng-template pTemplate="caption">
        <div class="flex justify-between">
          <div class="flex">
            <p-iconfield iconPosition="left" class="ml-auto">
              <p-inputicon>
                <i class="pi pi-search"></i>
              </p-inputicon>
              <input
                pInputText
                type="text"
                (input)="dt2.filterGlobal($event.target.value, 'contains')"
                placeholder="Buscar por nombre"
              />
            </p-iconfield>
          </div>
          <p-button
            label="Agregar"
            icon="pi pi-plus-circle"
            rounded
            (onClick)="editEmployee()"
          />
        </div>
      </ng-template>
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="employee.first_name" pSortIcon>
            Nombre <p-sortIcon field="employee.first_name" />
          </th>
          <th pSortableColumn="monthly_salary" pSortIcon>
            Salario Mensual <p-sortIcon field="monthly_salary" />
          </th>
          <th pSortableColumn="hourly_salary" pSortIcon>
            Salario por Hora <p-sortIcon field="hourly_salary" />
          </th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-employee>
        <tr>
          <td>
            {{ employee.employee?.first_name }}
            {{ employee.employee?.father_name }}
          </td>
          <td>{{ employee?.monthly_salary | currency : '$' }}</td>
          <td>{{ employee?.hourly_salary | currency : '$' }}</td>
          <td>
            <p-button
              icon="pi pi-pencil"
              rounded
              text
              severity="success"
              (onClick)="editEmployee(employee)"
            />
            <p-button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              (onClick)="deleteEmployee(employee)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollEmployeesComponent {
  public payrollId = input.required<string>();
  public employeesStore = inject(EmployeesStore);
  public employees = httpResource<PayrollEmployee[]>(() => ({
    url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/employee_payrolls`,
    method: 'GET',
    params: {
      select:
        '*, employee:employees(id, first_name, father_name, monthly_salary, hourly_salary)',
      payroll_id: `eq.${this.payrollId()}`,
    },
  }));

  private confirmationService = inject(ConfirmationService);

  private dialogService = inject(DialogService);

  private http = inject(HttpClient);

  public editEmployee(employee?: PayrollEmployee) {
    this.dialogService
      .open(PayrollEmployeesFormComponent, {
        data: {
          payrollId: this.payrollId(),
          employee,
        },
        modal: true,
        width: '48rem',
        header: 'Empleado',
      })
      .onClose.subscribe(() => {
        this.employees.reload();
      });
  }

  massiveCharge() {
    const items = this.employeesStore.activeEmployees().map((item) => ({
      payroll_id: this.payrollId(),
      employee_id: item.id,
      monthly_salary: item.monthly_salary,
      hourly_salary: item.monthly_salary / (104.28 * 2),
    }));
    this.http
      .post(
        `${process.env['ENV_SUPABASE_URL']}/rest/v1/employee_payrolls`,
        items
      )
      .subscribe(() => {
        this.employees.reload();
      });
  }

  public deleteEmployee(employee: PayrollEmployee) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este empleado?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.http
          .delete(
            `${process.env['ENV_SUPABASE_URL']}/rest/v1/employee_payrolls`,
            {
              params: {
                id: `eq.${employee.id}`,
              },
            }
          )
          .subscribe(() => {
            this.employees.reload();
          });
      },
    });
  }
}
