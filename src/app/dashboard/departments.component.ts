import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { Department } from '../models';
import { DepartmentsStore } from '../stores/departments.store';
import { DepartmentsFormComponent } from './departments-form.component';

@Component({
  selector: 'pt-departments',
  imports: [TableModule, Button, Card],
  providers: [DynamicDialogRef, DialogService],
  template: `
    <p-card>
      <ng-template #title>Areas</ng-template>
      <ng-template #subtitle
        >Listado de areas/departamentos de la empresa</ng-template
      >
      <div class="w-full flex justify-end">
        <p-button
          (click)="editDepartment()"
          label="Agregar"
          icon="pi pi-plus-circle"
          rounded
        />
      </div>
      <div>
        <p-table
          [value]="departments()"
          [paginator]="true"
          [rows]="5"
          [rowsPerPageOptions]="[5, 10, 20]"
        >
          <ng-template #header>
            <tr>
              <th pSortableColumn="name">
                Nombre
                <p-sortIcon field="name" />
              </th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td>{{ item.name }}</td>
              <td>
                <p-button
                  severity="success"
                  text
                  rounded
                  icon="pi pi-pen-to-square"
                  (onClick)="editDepartment(item)"
                />
                <p-button
                  severity="danger"
                  text
                  rounded
                  icon="pi pi-trash"
                  (onClick)="deleteDepartment(item.id)"
                />
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsComponent {
  readonly state = inject(DepartmentsStore);
  private ref = inject(DynamicDialogRef);
  private dialog = inject(DialogService);
  public departments = computed(() => [...this.state.entities()]);

  editDepartment(department?: Department) {
    this.ref = this.dialog.open(DepartmentsFormComponent, {
      header: 'Area',
      width: '36rem',
      modal: true,
      data: { department },
    });
  }

  deleteDepartment(id: string) {
    this.state.deleteItem(id);
  }
}
