import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CardModule } from 'primeng/card';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DashboardStore } from '../stores/dashboard.store';

@Component({
  selector: 'pt-home',
  imports: [BaseChartDirective, CardModule, DatePipe, CurrencyPipe],
  template: `<main class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <div>
      <h1 class="dark:text-gray-100 text-gray-800 font-black text-3xl mb-3">
        Dashboard
      </h1>
      <div class="flex flex-col md:grid md:grid-cols-4 gap-4">
        <p-card header="HeadCount">
          <div class="flex items-center justify-center">
            <p class="text-3xl font-semibold">{{ state.headCount() }}</p>
          </div>
        </p-card>
        <p-card header="Masculino">
          <div class="flex items-center justify-center gap-4">
            <i class="pi pi-mars text-2xl text-sky-500 dark:text-sky-400"></i>
            <p class="text-3xl font-semibold">
              {{ state.countByGender()['M'] }}
            </p>
          </div>
        </p-card>
        <p-card header="Femenino">
          <div class="flex items-center justify-center gap-4">
            <i
              class="pi pi-venus text-2xl text-pink-500 dark:text-pink-400"
            ></i>
            <p class="text-3xl font-semibold">
              {{ state.countByGender()['F'] }}
            </p>
          </div>
        </p-card>
        <p-card header="Sucursales">
          <div class="flex items-center justify-center">
            <p class="text-3xl font-semibold">{{ state.branchesCount() }}</p>
          </div>
        </p-card>
        <p-card header="Planilla mensual">
          <div class="flex items-center justify-center">
            <p class="text-3xl font-semibold">
              {{ state.monthlyBudget() | currency : '$' }}
            </p>
          </div>
        </p-card>
        <p-card
          header="Por sucursal"
          subheader="Listado de empleados por sucursal"
          class="md:col-span-4"
        >
          <div>
            <canvas
              baseChart
              #genderChart
              [datasets]="branchData()"
              [labels]="branchLabels()"
              type="bar"
              [options]="pieChartOptions"
              height="100"
            ></canvas>
          </div>
        </p-card>

        <p-card
          header="Cumpleañeros"
          class="col-span-2"
          [subheader]="currentMonth"
        >
          @for(item of state.birthDates(); track item) {
          <div class="flex justify-between w-full">
            <div class="flex-1 text-gray-700 dark:text-gray-50">
              {{ item.first_name }} {{ item.father_name }}
            </div>
            <div class="flex-1 text-gray-500 dark:text-gray-300 text-sm">
              {{ item.branch?.name }}
            </div>
            <div
              class="flex-none text-primary-700 dark:text-primary-300 font-semibold px-4"
            >
              {{ item.birth_date | date : 'd MMMM' }}
            </div>
          </div>
          }
        </p-card>
      </div>
    </div>
  </main> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public state = inject(DashboardStore);
  public genderLabels = computed(() =>
    this.state
      .employeesByGender()
      .map((x) => (x.gender === 'F' ? 'Femenino' : 'Masculino'))
  );
  public genderDatasets = computed(() => [
    {
      data: this.state.employeesByGender().map((x) => x.count),
    },
  ]);

  public currentMonth = format(new Date(), 'MMMM', { locale: es });

  public branchLabels = computed(() =>
    this.state.employeesByBranch().map((x) => x.branch?.name)
  );
  public branchData = computed(() => [
    {
      data: this.state.employeesByBranch().map((x) => x.count),
      label: 'Sucursal',
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
      ],
      borderWidth: 1,
      borderRadius: 10,
    },
  ]);
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  public pieChartType: ChartType = 'pie';
}
