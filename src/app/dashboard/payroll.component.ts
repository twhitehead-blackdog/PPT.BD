import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CreditorsStore } from '../stores/creditors.store';
import { PayrollStore } from '../stores/payroll.store';

@Component({
  selector: 'pt-payroll',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  providers: [PayrollStore, CreditorsStore],
  template: `<header class="bg-white dark:bg-gray-900 shadow-sm">
      <div
        class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-10"
      >
        <div class="block w-full overflow-scroll">
          <div class="flex gap-4">
            <a
              routerLink="payrolls"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-gray-600 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900',
                'dark:text-primary-900',
                'dark:hover:text-primary-900'
              ]"
              ><i class="pi pi-money-bill"></i>Planillas</a
            >
            <a
              routerLink="creditors"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-gray-600 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900',
                'dark:text-primary-900',
                'dark:hover:text-primary-900'
              ]"
              ><i class="pi pi-users"></i>Acreedores</a
            >
            <a
              routerLink="banks"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-gray-600 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900',
                'dark:text-primary-900',
                'dark:hover:text-primary-900'
              ]"
              ><i class="pi pi-building-columns"></i>Bancos</a
            >
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <router-outlet />
      </div>
    </main>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollComponent {}
