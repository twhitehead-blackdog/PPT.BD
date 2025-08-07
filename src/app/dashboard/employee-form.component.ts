import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toDate } from 'date-fns-tz';
import * as OTPAuth from 'otpauth';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import QRCode from 'qrcode';
import { debounceTime } from 'rxjs';
import { markGroupDirty } from 'src/app/services/util.service';
import { v4 } from 'uuid';
import { Bank, Employee, UniformSize } from '../models';
import { DashboardStore } from '../stores/dashboard.store';

@Component({
  selector: 'pt-employee-form',
  imports: [
    ReactiveFormsModule,
    InputText,
    InputNumber,
    DatePicker,
    Select,
    Checkbox,
    Button,
    TabsModule,
    Skeleton,
  ],
  template: `
    <div class="flex items-center justify-between">
      <div class="flex flex-col items-center gap-2">
        <h1>Datos del empleado</h1>
        <p-button
          text
          label="Volver al listado"
          icon="pi pi-arrow-left"
          (onClick)="cancelChanges(true)"
        />
      </div>
      <div class="flex col-span-4 justify-end gap-2">
        <p-button
          label="Cancelar"
          severity="secondary"
          outlined
          rounded
          icon="pi pi-refresh"
          (click)="cancelChanges()"
        />
        <p-button
          form="employee-form"
          label="Guardar cambios"
          (click)="saveChanges()"
          icon="pi pi-save"
          rounded
          [loading]="store.employees.isLoading()"
        />
      </div>
    </div>
    @if(currentEmployee.isLoading()) {
    <div class="flex flex-col md:grid grid-cols-4 md:gap-4 ">
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
    <form
      class="mt-4"
      [formGroup]="form"
      (ngSubmit)="saveChanges()"
      id="employee-form"
    >
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">Datos personales</p-tab>
          <p-tab value="1">Datos laborales</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <div class="flex flex-col md:grid grid-cols-4 md:gap-4">
              <div class="input-container">
                <label for="first_name">* Nombre</label>
                <input
                  type="text"
                  id="first_name"
                  pInputText
                  formControlName="first_name"
                  placeholder="Nombre"
                />
              </div>
              <div class="input-container">
                <label for="middle_name">Segundo Nombre</label>
                <input
                  type="text"
                  id="middle_name"
                  pInputText
                  formControlName="middle_name"
                  placeholder="Segundo Nombre"
                />
              </div>
              <div class="input-container">
                <label for="father_name">Apellido</label>
                <input
                  type="text"
                  id="father_name"
                  pInputText
                  formControlName="father_name"
                  placeholder="Apellido"
                />
              </div>
              <div class="input-container">
                <label for="mother_name">Apellido materno/casada</label>
                <input
                  type="text"
                  id="mother_name"
                  pInputText
                  formControlName="mother_name"
                  placeholder="Apellido materno"
                />
              </div>
              <div class="input-container">
                <label for="birth_date">Fecha de nacimiento</label>
                <p-datepicker
                  inputId="birth_date"
                  formControlName="birth_date"
                  iconDisplay="input"
                  [showIcon]="true"
                  appendTo="body"
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div class="input-container">
                <label for="document_id">Cédula</label>
                <input
                  type="text"
                  id="document_id"
                  pInputText
                  formControlName="document_id"
                  placeholder="Cédula de identidad"
                />
              </div>
              <div class="input-container">
                <label for="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  pInputText
                  formControlName="address"
                  placeholder="Calle, Ciudad, Provincia"
                />
              </div>
              <div class="input-container">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  pInputText
                  formControlName="email"
                />
              </div>
              <div class="input-container">
                <label for="work_email">Email laboral</label>
                <input
                  type="email"
                  id="work_email"
                  pInputText
                  formControlName="work_email"
                />
              </div>
              <div class="input-container">
                <label for="phone_number">Nro. Teléfono</label>
                <input
                  type="text"
                  id="phone_number"
                  pInputText
                  formControlName="phone_number"
                  placeholder="Teléfono"
                />
              </div>
              <div class="input-container">
                <label for="gender">Sexo</label>
                <p-select
                  inputId="gender"
                  [options]="['F', 'M']"
                  formControlName="gender"
                  appendTo="body"
                  placeholder="Seleccione un sexo"
                />
              </div>
              <div class="input-container">
                <label for="size">Talla</label>
                <p-select
                  inputId="size"
                  [options]="sizes"
                  formControlName="uniform_size"
                  appendTo="body"
                  placeholder="Seleccione una talla"
                />
              </div>

              <div class="input-container">
                <label for="bank">Banco</label>
                <p-select
                  inputId="bank"
                  [options]="banks.value()"
                  formControlName="bank"
                  optionLabel="name"
                  optionValue="id"
                  appendTo="body"
                  filter
                  placeholder="Seleccione un banco"
                />
              </div>
              <div class="input-container">
                <label for="account_number">Nro. de cuenta</label>
                <input
                  type="text"
                  id="account_number"
                  pInputText
                  formControlName="account_number"
                  placeholder="Nro. de cuenta"
                />
              </div>
              <div class="input-container">
                <label for="bank_account_type">Tipo de cuenta</label>
                <p-select
                  inputId="bank_account_type"
                  [options]="['Ahorros', 'Corriente']"
                  formControlName="bank_account_type"
                  appendTo="body"
                  placeholder="Seleccione un tipo de cuenta"
                />
              </div>
              <div class="flex gap-2 items-center">
                <p-checkbox
                  formControlName="is_active"
                  [binary]="true"
                  inputId="is_active"
                />
                <label for="is_active">Activo</label>
              </div>
            </div>
          </p-tabpanel>
          <p-tabpanel value="1">
            <div class="flex flex-col md:grid grid-cols-4 md:gap-4">
              <div class="input-container">
                <label for="company">Empresa</label>
                <p-select
                  [options]="store.companies.entities()"
                  optionLabel="name"
                  optionValue="id"
                  inputId="company"
                  formControlName="company_id"
                  placeholder="Seleccione una empresa"
                  appendTo="body"
                />
              </div>
              <div class="input-container">
                <label for="position">Cargo</label>
                <p-select
                  [options]="store.positions.entities()"
                  optionLabel="name"
                  optionValue="id"
                  inputId="position"
                  formControlName="position_id"
                  appendTo="body"
                  placeholder="Seleccione un cargo"
                />
              </div>
              <div class="input-container">
                <label for="department">Area</label>
                <p-select
                  [options]="store.departments.entities()"
                  optionLabel="name"
                  optionValue="id"
                  inputId="department"
                  formControlName="department_id"
                  appendTo="body"
                  placeholder="Seleccione un area"
                />
              </div>
              <div class="input-container">
                <label for="branch">Sucursal</label>
                <p-select
                  [options]="store.branches.entities()"
                  optionLabel="name"
                  optionValue="id"
                  inputId="branch"
                  formControlName="branch_id"
                  placeholder="Seleccione una sucursal"
                  appendTo="body"
                />
              </div>
              <div class="input-container">
                <label for="salary">Salario mensual</label>
                <p-inputNumber
                  mode="currency"
                  currency="USD"
                  formControlName="monthly_salary"
                  id="salary"
                  placeholder="Salario mensual"
                />
              </div>
              <div class="input-container">
                <label for="hourly_salary">Salario por hora</label>
                <p-inputNumber
                  mode="currency"
                  currency="USD"
                  formControlName="hourly_salary"
                  id="hourly_salary"
                  placeholder="Salario por hora"
                />
              </div>
              <div class="input-container">
                <label for="start_date">Fecha de inicio</label>
                <p-datepicker
                  inputId="start_date"
                  formControlName="start_date"
                  iconDisplay="input"
                  [showIcon]="true"
                  appendTo="body"
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div class="input-container">
                <label for="week_hours">Horas semanales</label>
                <p-inputNumber
                  formControlName="week_hours"
                  id="week_hours"
                  placeholder="Horas semanales"
                />
              </div>
              <div class="input-container">
                <label for="use_timelog">Marca reloj </label>
                <p-checkbox
                  [binary]="true"
                  formControlName="use_timelog"
                  inputId="use_timelog"
                />
              </div>
            </div>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </form>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {
  public store = inject(DashboardStore);
  public sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

  public banks = httpResource<Bank[]>(() => ({
    url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/banks`,
    method: 'GET',
    params: {
      select: 'id,name',
    },
  }));
  public employee_id = input<string>();
  private injector = inject(Injector);
  private message = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    first_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    middle_name: new FormControl('', { nonNullable: true }),
    father_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    mother_name: new FormControl('', { nonNullable: true }),
    document_id: new FormControl('', {
      nonNullable: true,
    }),
    email: new FormControl('', {
      nonNullable: true,
    }),
    phone_number: new FormControl('', {
      nonNullable: true,
    }),
    address: new FormControl('', { nonNullable: true }),
    birth_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
    start_date: new FormControl<Date>(new Date(), {
      nonNullable: true,
    }),
    branch_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    department_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    position_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gender: new FormControl<'F' | 'M'>('M', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    uniform_size: new FormControl<UniformSize | undefined>(undefined, {
      nonNullable: true,
    }),
    is_active: new FormControl(true, { nonNullable: true }),
    company_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    work_email: new FormControl('', { nonNullable: true }),
    monthly_salary: new FormControl(0, { nonNullable: true }),
    hourly_salary: new FormControl(0, { nonNullable: true }),
    qr_code: new FormControl('', { nonNullable: true }),
    code_uri: new FormControl('', { nonNullable: true }),
    bank: new FormControl('', { nonNullable: true }),
    account_number: new FormControl('', { nonNullable: true }),
    bank_account_type: new FormControl<'Ahorros' | 'Corriente'>('Ahorros', {
      nonNullable: true,
    }),
    week_hours: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(40), Validators.max(60)],
    }),
    use_timelog: new FormControl(false, { nonNullable: true }),
  });

  private confirmationService = inject(ConfirmationService);
  currentSalary = toSignal(
    this.form.get('monthly_salary')!.valueChanges.pipe(debounceTime(500)),
    {
      initialValue: 0,
    }
  );

  hourlySalary = computed(() => this.currentSalary() / (104.28 * 2));
  currentEmployee = httpResource<Employee[]>(() => {
    if (!this.employee_id()) {
      return;
    }
    return {
      url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/employees`,
      method: 'GET',
      params: {
        select:
          'id,first_name,father_name, middle_name, mother_name, document_id, email, phone_number, address, birth_date, start_date, branch_id, department_id, position_id, gender, uniform_size, is_active, company_id, work_email, monthly_salary, hourly_salary, qr_code, code_uri, bank, account_number, bank_account_type, week_hours, use_timelog',
        limit: '1',
        order: 'father_name',
        is_active: 'eq.true',
        id: `eq.${this.employee_id()}`,
      },
    };
  });

  ngOnInit() {
    effect(
      () => {
        const employee = this.currentEmployee.value()?.[0];
        if (!employee) return;

        untracked(() => {
          this.preloadForm(employee);
        });
      },
      { injector: this.injector }
    );
    effect(
      () => {
        this.form.get('hourly_salary')?.patchValue(this.hourlySalary());
      },
      { injector: this.injector }
    );
  }

  preloadForm(employee: Employee) {
    this.form.patchValue(employee);
    employee.birth_date &&
      this.form
        .get('birth_date')
        ?.patchValue(
          toDate(employee.birth_date, { timeZone: 'America/Panama' })
        );
    this.form
      .get('start_date')
      ?.patchValue(toDate(employee.start_date, { timeZone: 'America/Panama' }));
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  saveChanges() {
    const { pristine, invalid } = this.form;
    if (invalid) {
      this.message.add({
        severity: 'error',
        summary: 'No se guardaron cambios',
        detail: 'Formulario invalido',
      });
      markGroupDirty(this.form);
      return;
    }
    if (pristine) {
      this.message.add({
        severity: 'warn',
        summary: 'No se guardaron cambios',
        detail: 'No ha realizado ningun cambio en el formulario',
      });
      return;
    }
    if (!this.employee_id()) {
      this.addTimeclockQR();
    }
    if (this.employee_id()) {
      this.store.employees.editItem(this.form.getRawValue()).subscribe();
    } else {
      this.store.employees.createItem(this.form.getRawValue()).subscribe();
    }
  }

  cancelChanges(list = false) {
    const route = list ? ['../..'] : ['..'];
    if (this.form.pristine) {
      this.router.navigate(route, { relativeTo: this.route });
      return;
    }

    this.confirmationService.confirm({
      message: '¿Desea cancelar los cambios?',
      header: 'Cancelar',
      accept: () => {
        this.router.navigate(route, { relativeTo: this.route });
      },
    });
  }

  private addTimeclockQR() {
    const { first_name, father_name } = this.form.getRawValue();
    const totp = new OTPAuth.TOTP({
      issuer: 'Peopletrak Blackdog',
      label: `${first_name.trim()} ${father_name.trim()}`,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });

    const uri = totp.toString();
    QRCode.toDataURL(uri, async (error, qrCode) => {
      if (error) {
        console.error(error);
        return;
      }
      this.form.patchValue({ qr_code: qrCode, code_uri: uri });
    });
  }
}
