import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'pt-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<header class="bg-white  dark:bg-gray-900 shadow-sm">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="block w-full overflow-scroll">
          <div class="flex gap-4">
            <a
              routerLink="employees"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-gray-600 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900',
                'dark:text-primary-900',
                'dark:hover:text-primary-900'
              ]"
              ><i class="pi pi-users"></i> Empleados</a
            >
            <a
              routerLink="companies"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-gray-600 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900',
                'dark:text-primary-900',
                'dark:hover:text-primary-900'
              ]"
              ><i class="pi pi-building"></i> Empresas</a
            >
            <a
              routerLink="positions"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-gray-600 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900',
                'dark:text-primary-900',
                'dark:hover:text-primary-900'
              ]"
              ><i class="pi pi-user-plus"></i>Cargos</a
            >
            <a
              routerLink="branches"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-gray-600 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900',
                'dark:text-primary-900',
                'dark:hover:text-primary-900'
              ]"
              ><i class="pi pi-shop"></i>Sucursales</a
            >
            <a
              routerLink="departments"
              class="flex gap-2 items-center rounded-full font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:text-gray-600 px-4 py-2"
              [routerLinkActive]="[
                'bg-primary-100',
                'hover:bg-primary-100',
                'text-primary-900',
                'dark:text-primary-900',
                'dark:hover:text-primary-900'
              ]"
              ><i class="pi pi-sitemap"></i>Areas</a
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
export class AdminComponent {}
