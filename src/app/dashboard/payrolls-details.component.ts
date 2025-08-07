import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { Payroll } from '../models';
import { PayrollDebtsComponent } from './payroll-debts.component';
import { PayrollDeductionsComponent } from './payroll-deductions.component';
import { PayrollEmployeesComponent } from './payroll-employees.component';
import { PayrollPaymentsComponent } from './payroll-payments.component';

@Component({
  selector: 'pt-payrolls-details',
  imports: [
    TabsModule,
    Skeleton,
    PayrollDeductionsComponent,
    PayrollEmployeesComponent,
    PayrollPaymentsComponent,
    PayrollDebtsComponent,
  ],
  template: `@if(payroll.isLoading()) {
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
    <div>
      <h1 class="text-2xl font-bold mb-3  text-gray-700 dark:text-gray-200">
        <span class="font-medium">Planilla: </span>
        {{ payroll.value()?.[0]?.name }}
      </h1>
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">Pagos</p-tab>
          <p-tab value="1">Empleados</p-tab>
          <p-tab value="2">Deducciones</p-tab>
          <p-tab value="3">Deudas</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <pt-payroll-payments [payrollId]="payroll_id()" />
          </p-tabpanel>
          <p-tabpanel value="1">
            <pt-payroll-employees [payrollId]="payroll_id()" />
          </p-tabpanel>
          <p-tabpanel value="2">
            <pt-payroll-deductions [payrollId]="payroll_id()" />
          </p-tabpanel>
          <p-tabpanel value="3">
            <pt-payroll-debts [payrollId]="payroll_id()" />
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
    }`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollsDetailsComponent {
  public payroll_id = input.required<string>();
  public payroll = httpResource<Payroll[]>(() => ({
    url: `${process.env['ENV_SUPABASE_URL']}/rest/v1/payrolls`,
    method: 'GET',
    params: {
      select:
        '*, company:companies(*), employees:employee_payrolls(*), deductions:payroll_deductions(*)',
      id: `eq.${this.payroll_id()}`,
    },
  }));
}
