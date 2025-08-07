import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

import { AsyncPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthStore } from '../stores/auth.store';
import { BanksStore } from '../stores/banks.store';
import { BranchesStore } from '../stores/branches.store';
import { CompaniesStore } from '../stores/companies.store';
import { DashboardStore } from '../stores/dashboard.store';
import { DepartmentsStore } from '../stores/departments.store';
import { EmployeesStore } from '../stores/employees.store';
import { PayrollsStore } from '../stores/payrolls.store';
import { PositionsStore } from '../stores/positions.store';
import { SchedulesStore } from '../stores/schedules.store';

@Component({
  selector: 'pt-dashboard',
  providers: [
    AuthStore,
    DashboardStore,
    MessageService,
    ConfirmationService,
    EmployeesStore,
    BranchesStore,
    CompaniesStore,
    PositionsStore,
    DepartmentsStore,
    SchedulesStore,
    BanksStore,
    PayrollsStore,
  ],
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastModule,
    AccordionModule,
    RippleModule,
    CardModule,
    ConfirmDialogModule,
    Button,
    Avatar,
    AsyncPipe,
    MenuModule,
  ],
  template: `
    <p-toast />
    <p-confirmDialog />
    @let user = auth.user$ | async;
    <div class=" h-screen flex flex-col">
      <nav
        class="bg-gray-800 border-b border-gray-200 dark:border-gray-950 w-full min-w-0"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center">
              <a routerLink="/home" class="shrink-0">
                <img src="images/blackdog.png" class="h-8" alt="Peopletrak" />
              </a>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  @if(store.isAdmin()) {
                  <a
                    routerLink="/home"
                    routerLinkActive="selected"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                    ><i class="pi pi-home"></i> Inicio</a
                  >
                  } @if(store.isAdmin()) {
                  <a
                    routerLink="/admin"
                    routerLinkActive="selected"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    <i class="pi pi-building"></i> Administracion</a
                  >
                  } @if(store.isAdmin()) {
                  <a
                    routerLink="/payroll"
                    routerLinkActive="selected"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    <i class="pi pi-money-bill"></i> Nomina</a
                  >
                  } @if(store.isScheduleAdmin()) {
                  <a
                    routerLink="/time-management"
                    routerLinkActive="selected"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                    ><i class="pi pi-calendar"></i> Gestión de tiempo</a
                  >
                  }
                  <a
                    routerLink="/timeclock"
                    routerLinkActive="selected"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                    ><i class="pi pi-clock"></i> Reloj de marcación</a
                  >
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              @if(user) {
              <p-menu #menu [model]="items" popup />
              <div
                class="ml-4 flex items-center md:ml-6 gap-2 cursor-pointer"
                (click)="menu.toggle($event)"
              >
                <p-avatar [image]="user?.picture" shape="circle" />
                <div class="flex flex-col">
                  <div class="text-base/5 font-medium text-white">
                    {{ store.currentEmployee()?.first_name }}
                    {{ store.currentEmployee()?.father_name }}
                  </div>
                  <div class="text-sm text-gray-400">
                    {{ store.currentEmployee()?.position?.name }}
                  </div>
                </div>
              </div>

              }
            </div>
            <div class="-mr-2 flex md:hidden">
              <p-button
                rounded
                text
                [icon]="isCollapsed() ? 'pi pi-bars' : 'pi pi-times'"
                severity="secondary"
                (onClick)="toggleMenu()"
              />
            </div>
          </div>
        </div>
        <div class="md:hidden" [class.hidden]="isCollapsed()">
          <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            @if(store.isAdmin()) {
            <a
              routerLink="/home"
              [routerLinkActive]="[
                'bg-gray-900',
                'hover:bg-gray-900',
                'text-white'
              ]"
              class="rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex gap-2 items-center "
              ><i class="pi pi-home"></i> Inicio</a
            >
            } @if(store.isAdmin()) {
            <a
              routerLink="/admin"
              [routerLinkActive]="[
                'bg-gray-900',
                'hover:bg-gray-900',
                'text-white'
              ]"
              class="rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex gap-2 items-center "
              ><i class="pi pi-building"></i> Administración</a
            >
            } @if(store.isScheduleAdmin()) {
            <a
              routerLink="/time-management"
              [routerLinkActive]="[
                'bg-gray-900',
                'hover:bg-gray-900',
                'text-white'
              ]"
              class="rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex gap-2 items-center "
              ><i class="pi pi-calendar"></i> Gestión de tiempo</a
            >
            }
            <a
              routerLink="/payroll"
              [routerLinkActive]="[
                'bg-gray-900',
                'hover:bg-gray-900',
                'text-white'
              ]"
              class="rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex gap-2 items-center "
              ><i class="pi pi-money-bill"></i> Nomina</a
            >
            <a
              routerLink="/timeclock"
              [routerLinkActive]="[
                'bg-gray-900',
                'hover:bg-gray-900',
                'text-white'
              ]"
              class="rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex gap-2 items-center "
              ><i class="pi pi-clock"></i> Reloj de marcación</a
            >
          </div>
          @if(user) {
          <div class="border-t border-gray-700 pt-4 pb-3">
            <div class="flex items-center px-5">
              <p-avatar [image]="user.picture" shape="circle" />
              <div class="ml-3">
                <div class="text-base/5 font-medium text-white">
                  {{ store.currentEmployee()?.first_name }}
                  {{ store.currentEmployee()?.father_name }}
                </div>
                <div class="text-sm text-gray-400">
                  {{ store.currentEmployee()?.position?.name }}
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </nav>
      <div class="flex-1 overflow-y-scroll"><router-outlet /></div>
    </div>
  `,
  styles: `
      .selected {
        @apply bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out;
      }
      `,
})
export class DashboardComponent {
  public isCollapsed = signal(true);
  public store = inject(DashboardStore);
  public auth = inject(AuthService);
  public items: MenuItem[] = [
    {
      label: 'Cerrar sesion',
      icon: 'pi pi-sign-out',
      command: () => this.auth.logout(),
    },
  ];

  async toggleMenu() {
    this.isCollapsed.update((value) => !value);
  }

  toggleCompany(companyId: string | null) {
    this.store.toggleCompany(companyId);
  }
}
