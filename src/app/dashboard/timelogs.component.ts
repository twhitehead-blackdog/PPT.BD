import { DatePipe, NgClass } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addDays, differenceInMinutes, format, startOfMonth } from 'date-fns';
import { trim } from 'lodash';
import { MessageService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { utils, writeFile } from 'xlsx';
import { Branch, colorVariants, Employee } from '../models';
import { DashboardStore } from '../stores/dashboard.store';
import { EmployeesStore } from '../stores/employees.store';

@Component({
  selector: 'pt-timelogs',
  imports: [
    Button,
    Card,
    Select,
    DatePicker,
    FormsModule,
    DatePipe,
    TableModule,
    TooltipModule,
    Avatar,
    ToastModule,
    NgClass,
    ToggleSwitch,
  ],
  template: `<p-card
    header="Marcaciones"
    subheader="Listado de marcaciones de empleados"
  >
    <div class="flex items-center gap-2 mb-3">
      <label for="delayed">Solo retrasos</label>
      <p-toggleSwitch
        inputId="delayed"
        [(ngModel)]="onlyDelayed"
        onLabel="Solo retrasos"
        offLabel="Todos"
      />
    </div>
    <div class="flex flex-col md:flex-row gap-3 items-center mb-3">
      <div class="input-container">
        <p-select
          [options]="employees.employeesList()"
          optionLabel="short_name"
          optionValue="id"
          placeholder="--TODOS--"
          filter
          showClear
          appendTo="body"
          [(ngModel)]="employeeId"
        />
      </div>
      <div class="input-container">
        <p-select
          placeholder="--TODAS LAS SUCURSALES--"
          [(ngModel)]="branchId"
          [options]="store.branches.entities()"
          optionLabel="name"
          optionValue="id"
          showClear
          appendTo="body"
        />
      </div>
      <div class="input-container">
        <p-datepicker
          placeholder="Fecha"
          selectionMode="range"
          appendTo="body"
          [(ngModel)]="dateRange"
        />
      </div>

      <div>
        <p-button
          icon="pi pi-file-excel"
          [loading]="loading()"
          (click)="generateReport()"
          severity="success"
          [disabled]="timelogsReport().length === 0"
        />
      </div>
    </div>
    <p-table
      [value]="filteredDaylogs()"
      [rows]="10"
      paginator
      showGridlines
      stripedRows
      [loading]="this.logs.isLoading()"
    >
      <ng-template #header>
        <tr>
          <th>Empleado</th>
          <th>Día</th>
          <th>Horario</th>
          <th>Entrada</th>
          <th>Inicio de almuerzo</th>
          <th>Fin de almuerzo</th>
          <th>Salida</th>
        </tr>
      </ng-template>
      <ng-template #body let-log>
        <tr>
          <td>{{ log.employee.first_name }} {{ log.employee.father_name }}</td>
          <td>{{ log.day | date : 'mediumDate' }}</td>
          <td>
            <span
              class="rounded text-sm px-2 py-1 font-semibold"
              [ngClass]="
                log.schedule?.schedule
                  ? colorVariants[log.schedule.schedule.color]
                  : ''
              "
              >{{ log?.schedule?.schedule.name }}</span
            >
          </td>
          <td>
            <div class="flex gap-3 items-center">
              <span
                [ngClass]="{
                  'text-red-500 font-semibold': log.delay
                }"
                >{{ log.entry?.date | date : 'hh:mm a' }}</span
              >
              @if(log.entry) {
              <p-avatar
                class="cursor-pointer"
                shape="circle"
                [label]="log.entry?.branch.short_name"
                [pTooltip]="log.entry?.branch.name"
                tooltipPosition="top"
              />}
              {{ log.delay ? 'Retraso de ' + log.delay + ' min' : '' }}
            </div>
          </td>
          <td>
            <div class="flex gap-1 items-center">
              {{ log.lunch_start?.date | date : 'hh:mm a' }}
              @if(log.lunch_start) {
              <p-avatar
                shape="circle"
                [label]="log.lunch_start?.branch.short_name"
                [pTooltip]="log.lunch_start?.branch.name"
                tooltipPosition="top"
              />
              }
            </div>
          </td>
          <td>
            <div class="flex gap-1 items-center">
              {{ log.lunch_end?.date | date : 'hh:mm a' }}
              @if(log.lunch_end) {
              <p-avatar
                shape="circle"
                [label]="log.lunch_end?.branch.short_name"
                [pTooltip]="log.lunch_end?.branch.name"
                tooltipPosition="top"
              />}
            </div>
          </td>
          <td>
            <div class="flex gap-1 items-center">
              {{ log.exit?.date | date : 'hh:mm a' }}
              @if(log.exit) {
              <p-avatar
                shape="circle"
                [label]="log.exit?.branch.short_name"
                [pTooltip]="log.exit?.branch.name"
                tooltipPosition="top"
              />}
            </div>
          </td>
        </tr>
      </ng-template>
      <ng-template #emptymessage>
        <tr>
          <td colspan="7">
            <div class="flex flex-col items-center justify-center gap-4">
              <p>No se encontraron registros</p>
              <p-button
                label="Limpiar"
                icon="pi pi-refresh"
                (click)="employeeId.set('')"
              />
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelogsComponent {
  public employees = inject(EmployeesStore);
  public dateRange = signal<Date[]>([startOfMonth(new Date()), new Date()]);
  public employeeId = model<string>();
  public branchId = model<string>();
  public store = inject(DashboardStore);
  public onlyDelayed = signal(false);

  public loading = signal(false);
  private message = inject(MessageService);
  public colorVariants = colorVariants;

  private selectedEmployee = computed(() =>
    this.employees.employeesList().find((x) => x.id === this.employeeId())
  );

  days = computed(() => {
    const days = [];
    for (
      let date = this.dateRange()?.[0];
      date <= this.dateRange()?.[1];
      date = addDays(date, 1)
    ) {
      days.push(format(date, 'yyyy-MM-dd'));
    }
    return days;
  });

  public schedules = httpResource<any[]>(() => {
    return {
      url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/employee_schedules`,
      method: 'GET',
      params: {
        select: '*,schedule:schedules(*)',
        start_date: `gte.${format(this.dateRange()[0], 'yyyy-MM-dd 06:00:00')}`,
        end_date: `lte.${format(this.dateRange()[1], 'yyyy-MM-dd 06:00:00')}`,
      },
    };
  });

  public logs = httpResource<any[]>(() => {
    if (!this.dateRange()[0] || !this.dateRange()[1]) {
      return undefined;
    }
    return {
      url: `${
        process.env['ENV_SUPABASE_URL']
      }/rest/v1/timelogs?created_at=lte.${format(
        addDays(this.dateRange()[1], 1),
        'yyyy-MM-dd 06:00:00'
      )}`,
      method: 'GET',
      params: this.queryParams(),
    };
  });

  public queryParams = computed(() => {
    const params: {
      select: string;
      created_at: string;
      employee_id?: string;
    } = {
      select:
        '*,employee:employees(id,first_name,father_name, branch:branches(id, name)),branch:branches(id, name, short_name)',
      created_at: `gte.${format(this.dateRange()[0], 'yyyy-MM-dd 06:00:00')}`,
    };
    if (this.employeeId()) {
      params['employee_id'] = `eq.${this.employeeId()}`;
    }
    return params;
  });

  public dayLogs = computed(() =>
    (this.logs.value() ?? [])
      .filter((x) =>
        this.branchId() ? x.employee.branch.id === this.branchId() : true
      )
      .map((x) => ({ ...x, day: format(x.created_at, 'yyyy-MM-dd') }))
      .reduce<
        {
          employee: Partial<Employee>;
          day: string;
          schedule?: any;
          delay?: number | string;
          entry?: { date: Date; branch: Branch };
          lunch_start?: { date: Date; branch: Branch };
          lunch_end?: { date: Date; branch: Branch };
          exit?: { date: Date; branch: Branch };
        }[]
      >((acc, x) => {
        if (!acc.filter((day) => day.employee.id === x.employee.id).length) {
          this.days().forEach((day) => {
            const schedule = this.schedules
              .value()
              ?.find(
                (schedule) =>
                  schedule.employee_id === x.employee.id &&
                  schedule.start_date <= day &&
                  schedule.end_date >= day
              );

            acc.push({
              employee: x.employee,
              day,
              schedule,
              delay: undefined,
              entry: undefined,
              lunch_start: undefined,
              lunch_end: undefined,
              exit: undefined,
            });
          });
        }

        const index = acc.findIndex(
          (y) => y.day === x.day && y.employee.id === x.employee.id
        );

        acc[index] = {
          ...acc[index],
          [x.type]: { date: x.created_at, branch: x.branch, id: x.id },
        };
        if (acc[index].schedule) {
          if (acc[index].schedule.schedule.day_off) {
            acc[index].delay = 'DIA LIBRE';
          } else {
            if (acc[index].entry) {
              const entryTime = format(acc[index].entry.date, 'hh:mm:ss');
              const scheduleTime = acc[index].schedule.schedule.entry_time;
              const delay = this.calcTimeDiff(entryTime, scheduleTime);

              if (delay > acc[index].schedule.schedule.minutes_tolerance) {
                acc[index].delay = delay;
              }
            }
          }
        }
        return acc;
      }, [])
      .sort((a, b) =>
        (a.employee.first_name || '').localeCompare(b.employee.first_name || '')
      )
  );

  public filteredDaylogs = computed(() =>
    this.dayLogs().filter((x) => (this.onlyDelayed() ? x.delay : true))
  );

  calcTimeDiff = (time1: string, time2: string) => {
    const timeStart = new Date();
    const timeEnd = new Date();
    const valueStart = time1.split(':');
    const valueEnd = time2.split(':');

    timeStart.setHours(+valueStart[0], +valueStart[1], 0, 0);
    timeEnd.setHours(+valueEnd[0], +valueEnd[1], 0, 0);

    return differenceInMinutes(timeStart, timeEnd);
  };

  public timelogsReport = computed(() =>
    this.dayLogs().map((x) => ({
      EMPLEADO: x.employee.first_name + ' ' + x.employee.father_name,
      DIA: x.day,
      HORARIO: x.schedule?.schedule.name,
      RETRASO:
        x.delay ?? (typeof x.delay === 'number' ? x.delay + ' min' : x.delay),
      ENTRADA: x.entry?.date ? format(x.entry?.date, 'hh:mm a') : 'SIN MARCA',
      INICIO_DESCANSO: x.lunch_start?.date
        ? format(x.lunch_start?.date, 'hh:mm a')
        : 'SIN MARCA',
      FIN_DESCANSO: x.lunch_end?.date
        ? format(x.lunch_end?.date, 'hh:mm a')
        : 'SIN MARCA',
      SALIDA: x.exit?.date ? format(x.exit?.date, 'hh:mm a') : 'SIN MARCA',
    }))
  );

  generateReport() {
    try {
      this.loading.set(true);
      const ws = utils.json_to_sheet(this.timelogsReport());
      const wb = utils.book_new();

      utils.book_append_sheet(wb, ws, this.selectedEmployee()?.short_name);
      const name = this.selectedEmployee()
        ? trim(this.selectedEmployee()?.short_name.toUpperCase()).replace(
            ' ',
            '_'
          )
        : 'GLOBAL';

      writeFile(
        wb,
        `${name}_${format(this.dateRange()[0], 'yyyyMMdd')}-${format(
          this.dateRange()[1],
          'yyyyMMdd'
        )}.xlsx`
      );
    } catch (error) {
      console.error(error);
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Algo salio mal, intente nuevamente',
      });
    } finally {
      this.loading.set(false);
    }
  }
}
