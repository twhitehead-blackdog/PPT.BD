import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';

import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Skeleton } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { Employee } from '../models';
import { AgePipe } from '../pipes/age.pipe';
import { SeniorityPipe } from '../pipes/seniority.pipe';
import { EmployeesStore } from '../stores/employees.store';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeSchedulesComponent } from './employee-schedules.component';
import { TerminationFormComponent } from './termination-form.component';
import { TimeOffsComponent } from './time-offs.component';

@Component({
  selector: 'pt-employee-detail',
  imports: [
    Card,
    DatePipe,
    CurrencyPipe,
    MenuModule,
    Button,
    AgePipe,
    SeniorityPipe,
    TabsModule,
    EmployeeSchedulesComponent,
    Skeleton,
  ],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <div class="mx-4 md:mx-6 flex flex-col gap-2">
      <p-tabs value="0" scrollable>
        <p-tablist>
          <p-tab value="0"><i class="pi pi-user"></i> Datos Personales</p-tab>
          <p-tab value="1"><i class="pi pi-clock"></i> Horarios</p-tab>
          <p-tab value="2"><i class="pi pi-clock"></i> Marcacion</p-tab>
          <p-tab value="3"><i class="pi pi-calendar"></i> Tiempos fuera</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <div>
              <div class="md:flex justify-between items-center">
                <div class="px-4 sm:px-0">
                  <h3
                    class="text-base/7 font-semibold text-primary-800 dark:text-gray-50"
                  >
                    {{ currentEmployee()?.first_name }}
                    {{ currentEmployee()?.father_name }}
                  </h3>
                  <p
                    class="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400"
                  >
                    {{ currentEmployee()?.position?.name }}
                  </p>
                </div>
                <p-menu #menu [model]="items" [popup]="true" appendTo="body" />
                <p-button
                  label="Acciones"
                  icon="pi pi-ellipsis-v"
                  rounded
                  (onClick)="menu.toggle($event)"
                />
              </div>
              @if(employee.isLoading()) {
              <div class="flex flex-col gap-4">
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
                <p-skeleton shape="rectangle" height="2rem" />
              </div>
              } @else {
              <div class="mt-6 border-t border-gray-100 dark:border-gray-600">
                <dl class="divide-y divide-gray-100 dark:divide-gray-600">
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Nombre completo
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.first_name }}
                      {{ currentEmployee()?.middle_name }}
                      {{ currentEmployee()?.father_name }}
                      {{ currentEmployee()?.mother_name }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Nro. documento
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.document_id }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Departamento
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.department?.name }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Sucursal
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.branch?.name }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Cargo
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.position?.name }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Salario
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.monthly_salary | currency : '$' }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Fecha de nacimiento (edad)
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.birth_date | date : 'mediumDate' }}
                      ({{ currentEmployee()?.birth_date | age }})
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Direccion
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.address }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Email/Email laboral
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.email }} /
                      {{ currentEmployee()?.work_email }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Nro. Telefono
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.phone_number }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Fecha de ingreso
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.start_date | date : 'mediumDate' }}
                      / {{ currentEmployee()?.start_date! | seniority }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Talla
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.uniform_size }}
                    </dd>
                  </div>
                  <div
                    class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt
                      class="text-sm/6 font-medium text-primary-800 dark:text-primary-200"
                    >
                      Cuenta de banco
                    </dt>
                    <dd
                      class="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0"
                    >
                      {{ currentEmployee()?.bank }} -
                      {{ currentEmployee()?.bank_account_type }}:
                      {{ currentEmployee()?.account_number }}
                    </dd>
                  </div>
                </dl>
              </div>
              }
            </div>
          </p-tabpanel>
          <p-tabpanel value="1">
            <pt-employee-schedules [employeeId]="employee_id()" />
          </p-tabpanel>
          <p-tabpanel value="2">
            <img src="{{ currentEmployee()?.qr_code }}" alt="QR Code" />
          </p-tabpanel>
          <p-tabpanel value="3">
            @for(timeoff of currentEmployee()?.timeoffs; track $index) {
            <p-card [header]="timeoff.type?.name">
              {{ timeoff.date_from }}
              {{ timeoff.date_to }}
            </p-card>

            }</p-tabpanel
          >
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
  styles: `
      p {
        margin-bottom: 0 !important;
      }

      .label {
        @apply text-indigo-400 text-sm;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit {
  protected readonly state = inject(EmployeesStore);

  public employee_id = input.required<string>();
  public employee = httpResource<Employee[]>(() => ({
    url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/employees`,
    method: 'GET',
    params: {
      select:
        'id, department:departments(id, name), branch:branches(id, name), position:positions(id, name), first_name,father_name, middle_name, mother_name,document_id, email, phone_number, address, birth_date, start_date, branch_id, department_id, position_id, gender, uniform_size, is_active, company_id, work_email, monthly_salary, hourly_salary, qr_code, code_uri, bank, account_number, bank_account_type',
      limit: '1',
      order: 'father_name',
      is_active: 'eq.true',
      id: `eq.${this.employee_id()}`,
    },
  }));
  public currentEmployee = computed(() => this.employee.value()?.[0]);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected readonly items: MenuItem[] = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => {
        this.router.navigate(['edit'], { relativeTo: this.route });
      },
    },
    {
      label: 'Tiempo fuera',
      icon: 'pi pi-calendar',
      command: () => {
        this.timeOff();
      },
    },
    {
      label: 'Salida',
      icon: 'pi pi-undo',
      command: () => {
        this.terminateEmployee();
      },
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => {
        this.deleteEmployee();
      },
    },
  ];
  private dialog = inject(DialogService);
  private ref = inject(DynamicDialogRef);

  ngOnInit(): void {
    this.state.selectEntity(this.employee_id());
  }

  editEmployee() {
    this.ref = this.dialog.open(EmployeeFormComponent, {
      header: 'Datos de empleado',
      width: '90vw',
      data: { employee: this.currentEmployee() },
    });
  }

  terminateEmployee() {
    this.ref = this.dialog.open(TerminationFormComponent, {
      data: { employee: this.currentEmployee() },
      width: '90vw',
      header: 'Terminacion de empleado',
    });
  }

  timeOff() {
    this.ref = this.dialog.open(TimeOffsComponent, {
      data: {
        employee: this.currentEmployee(),
      },
      width: '60vw',
      header: 'Tiempo fuera de empleado',
    });
  }

  deleteEmployee() {
    this.state.deleteItem(this.employee_id());
  }
}
