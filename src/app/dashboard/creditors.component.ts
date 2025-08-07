import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Creditor } from '../models';
import { PayrollStore } from '../stores/payroll.store';
import { CreditorsFormComponent } from './creditors-form.component';

@Component({
  selector: 'pt-creditors',
  imports: [TableModule, Button, Card, DatePipe],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-card>
    <ng-template #title>Acreedores</ng-template>
    <ng-template #subtitle>Listado de acreedores</ng-template>
    <div class="w-full flex justify-end">
      <p-button
        (click)="editCreditor()"
        label="Agregar"
        icon="pi pi-plus-circle"
        rounded
      />
    </div>
    <p-table
      [value]="store.creditors.entities()"
      [paginator]="true"
      [rows]="5"
      [rowsPerPageOptions]="[5, 10, 20]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} acreedores"
    >
      <ng-template #header>
        <tr>
          <th pSortableColumn="name">
            Nombre
            <p-sortIcon field="name" />
          </th>
          <th pSortableColumn="created_at">
            Fecha de creación
            <p-sortIcon field="created_at" />
          </th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-item>
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.created_at | date : 'medium' }}</td>
          <td>
            <p-button
              severity="success"
              text
              rounded
              icon="pi pi-pen-to-square"
              (onClick)="editCreditor(item)"
            />
            <p-button
              severity="danger"
              text
              rounded
              icon="pi pi-trash"
              (onClick)="store.creditors.deleteItem(item.id)"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditorsComponent {
  public store = inject(PayrollStore);
  private ref = inject(DynamicDialogRef);
  private dialogService = inject(DialogService);

  editCreditor(creditor?: Creditor) {
    this.ref = this.dialogService.open(CreditorsFormComponent, {
      width: '36rem',
      data: { creditor },
      header: 'Datos del accreedor',
      modal: true,
    });
  }
}
