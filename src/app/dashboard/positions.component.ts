import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Position } from '../models';
import { DashboardStore } from '../stores/dashboard.store';
import { PositionsFormComponent } from './positions-form.component';

@Component({
  selector: 'pt-positions',
  imports: [TableModule, Card, Button, IconField, InputIcon, InputText],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-card>
      <ng-template #title>Cargos</ng-template>
      <ng-template #subtitle>Listado de cargos de la empresa</ng-template>

      <p-table
        #dt
        [value]="positions()"
        [paginator]="true"
        [rowsPerPageOptions]="[5, 10, 20]"
        [rows]="5"
        [globalFilterFields]="['name', 'department.name']"
      >
        <ng-template #caption>
          <div class="flex gap-4 flex-col md:flex-row justify-between">
            <p-iconfield iconPosition="left">
              <p-inputicon>
                <i class="pi pi-search"></i>
              </p-inputicon>
              <input
                pInputText
                type="text"
                (input)="dt.filterGlobal($event.target?.value, 'contains')"
                placeholder="Buscar"
                fluid
              />
            </p-iconfield>
            <p-button
              label="Agregar"
              (click)="editPosition()"
              icon="pi pi-plus-circle"
              rounded
            />
          </div>
        </ng-template>
        <ng-template #header>
          <tr>
            <th pSortableColumn="name">
              Nombre
              <p-sortIcon field="name" />
            </th>
            <th pSortableColumn="department.name">
              Area
              <p-sortIcon field="department.name" />
            </th>
            <th>Admin</th>
            <th>Horarios</th>
            <th>App. horarios</th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.department?.name }}</td>
            <td>
              @if(item.admin) {
              <i
                class="pi pi-check-circle text-emerald-600"
                style="font-size: 1.25rem"
              ></i>
              } @else {
              <i
                class="pi pi-times-circle text-red-600"
                style="font-size: 1.25rem"
              ></i>
              }
            </td>
            <td>
              @if(item.schedule_admin) {
              <i
                class="pi pi-check-circle text-emerald-600"
                style="font-size: 1.25rem"
              ></i>
              } @else {
              <i
                class="pi pi-times-circle text-red-600"
                style="font-size: 1.25rem"
              ></i>
              }
            </td>
            <td>
              @if(item.schedule_approver) {
              <i
                class="pi pi-check-circle text-emerald-600"
                style="font-size: 1.25rem"
              ></i>
              } @else {
              <i
                class="pi pi-times-circle text-red-600"
                style="font-size: 1.25rem"
              ></i>
              }
            </td>
            <td>
              <p-button
                severity="success"
                text
                rounded
                icon="pi pi-pen-to-square"
                (onClick)="editPosition(item)"
              />
              <p-button
                severity="danger"
                text
                rounded
                icon="pi pi-trash"
                (onClick)="deletePosition(item.id)"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionsComponent implements OnInit {
  readonly store = inject(DashboardStore);

  private dialog = inject(DialogService);
  private ref = inject(DynamicDialogRef);
  public positions = computed(() => [...this.store.positions.entities()]);

  ngOnInit() {
    this.store.positions.fetchItems();
  }

  editPosition(position?: Position) {
    this.ref = this.dialog.open(PositionsFormComponent, {
      header: 'Cargo',
      width: '36rem',
      data: { position },
      modal: true,
    });
  }

  deletePosition(id: string) {
    this.store.positions.deleteItem(id);
  }
}
