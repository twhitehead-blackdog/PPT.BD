import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Payroll } from '../models';
import { PayrollsStore } from '../stores/payrolls.store';
import { PayrollsFormComponent } from './payrolls-form.component';

@Component({
  selector: 'pt-payrolls',
  imports: [TableModule, Button, Card, DatePipe, RouterLink],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-card>
    <ng-template #title> Planillas </ng-template>
    <ng-template #subtitle> Listado de planillas </ng-template>
    <div class="w-full flex justify-end">
      <p-button
        (click)="editPayroll()"
        label="Agregar"
        icon="pi pi-plus-circle"
        rounded
      />
    </div>
    <p-table [value]="store.entities() || []" [loading]="store.isLoading()">
      <ng-template pTemplate="header">
        <tr>
          <th>Nombre</th>
          <th>Empresa</th>
          <th>Creada</th>
          <th>Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-payroll>
        <tr>
          <td>{{ payroll.name }}</td>
          <td>{{ payroll.company.name }}</td>
          <td>{{ payroll.created_at | date : 'short' }}</td>
          <td class="flex gap-2">
            <p-button
              label="Detalles"
              icon="pi pi-calculator"
              size="small"
              severity="info"
              [routerLink]="payroll.id"
              rounded
            />
            <p-button
              (click)="editPayroll(payroll)"
              label="Editar"
              icon="pi pi-pencil"
              severity="success"
              size="small"
              rounded
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollsComponent {
  public dialog = inject(DialogService);
  public store = inject(PayrollsStore);

  public editPayroll(payroll?: Payroll) {
    this.dialog.open(PayrollsFormComponent, {
      header: 'Agregar planilla',
      width: '36rem',
      data: { payroll },
      modal: true,
    });
  }
}
