import { CurrencyPipe, DecimalPipe } from '@angular/common';
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
import { TableModule } from 'primeng/table';
import { PayrollDeduction } from '../models';
import { PayrollDeductionsFormComponent } from './payroll-deductions-form.component';

@Component({
  selector: 'pt-payroll-deductions',
  imports: [TableModule, Button, DecimalPipe, CurrencyPipe],
  providers: [DynamicDialogRef, DialogService],
  template: ` <p-table
    [value]="payrollDeductions.value() || []"
    [loading]="payrollDeductions.isLoading()"
  >
    <ng-template #caption>
      <div class="flex justify-end">
        <p-button
          label="Agregar"
          icon="pi pi-plus-circle"
          rounded
          (onClick)="editDeduction()"
        />
      </div>
    </ng-template>
    <ng-template pTemplate="header">
      <tr>
        <th>Nombre</th>
        <th>Valor</th>
        <th>Tipo de Calculo</th>
        <th>Salario Minimo</th>
        <th>Impuesto sobre la renta</th>
        <th></th>
      </tr>
    </ng-template>
    <ng-template pTemplate="body" let-deduction>
      <tr>
        <td>{{ deduction.name }}</td>
        <td>{{ deduction.value | number : '1.2-2' }}</td>
        <td>
          {{ deduction.calculation_type === 'fixed' ? 'Fijo' : 'Porcentaje' }}
        </td>
        <td>{{ deduction.min_salary | currency : '$' }}</td>
        <td>{{ deduction.income_tax ? 'SI' : 'NO' }}</td>
        <td>
          <p-button
            icon="pi pi-pencil"
            rounded
            text
            severity="success"
            (onClick)="editDeduction(deduction)"
          />
          <p-button
            icon="pi pi-trash"
            rounded
            text
            severity="danger"
            (onClick)="deleteDeduction(deduction)"
          />
        </td>
      </tr>
    </ng-template>
  </p-table>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollDeductionsComponent {
  public payrollId = input.required<string>();
  public payrollDeductions = httpResource<PayrollDeduction[]>(() => ({
    url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/payroll_deductions`,
    method: 'GET',
    params: {
      select: '*',
      payroll_id: `eq.${this.payrollId()}`,
    },
  }));

  private confirm = inject(ConfirmationService);
  private http = inject(HttpClient);

  public dialogService = inject(DialogService);

  public editDeduction(deduction?: PayrollDeduction) {
    this.dialogService
      .open(PayrollDeductionsFormComponent, {
        data: {
          payrollId: this.payrollId(),
          deduction,
        },
        modal: true,
        width: '48rem',
        header: 'Deducción',
      })
      .onClose.subscribe(() => {
        this.payrollDeductions.reload();
      });
  }

  public deleteDeduction(deduction: PayrollDeduction) {
    this.confirm.confirm({
      message: '¿Estas seguro de eliminar esta deducción?',
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
            `${process.env['ENV_SUPABASE_URL']}/rest/v1/payroll_deductions`,
            {
              params: {
                id: `eq.${deduction.id}`,
              },
            }
          )
          .subscribe(() => {
            this.payrollDeductions.reload();
          });
      },
    });
  }
}
