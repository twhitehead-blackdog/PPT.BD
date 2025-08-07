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
import { Company } from '../models';
import { CompaniesStore } from '../stores/companies.store';
import { CompaniesFormComponent } from './companies-form.component';

@Component({
  selector: 'pt-companies',
  imports: [Card, Button, TableModule],
  providers: [DynamicDialogRef, DialogService],
  template: `<p-card>
    <ng-template #subtitle>Listado de empresas</ng-template>
    <ng-template #title>Empresas</ng-template>
    <div class="w-full flex justify-end">
      <p-button
        label="Agregar"
        icon="pi pi-plus-circle"
        rounded
        (onClick)="editCompany()"
      />
    </div>
    <div>
      <p-table
        [value]="companies()"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[5, 10, 20]"
      >
        <ng-template #header>
          <tr>
            <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
            <th pSortableColumn="phone_number">
              Nro. Telefono <p-sortIcon field="phone_number" />
            </th>
            <th pSortableColumn="address">
              Direccion <p-sortIcon field="address" />
            </th>
            <th></th>
          </tr>
        </ng-template>
        <ng-template #body let-item>
          <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.phone_number }}</td>
            <td>{{ item.address }}</td>
            <td>
              <p-button
                severity="success"
                text
                round
                icon="pi pi-pen-to-square"
                (onClick)="editCompany(item)"
              />
              <p-button
                severity="danger"
                text
                round
                icon="pi pi-trash"
                (onClick)="deleteCompany(item.id)"
              />
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </p-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesComponent {
  protected store = inject(CompaniesStore);
  private dialog = inject(DialogService);
  public companies = computed(() => this.store.entities());

  editCompany(company?: Company) {
    this.dialog.open(CompaniesFormComponent, {
      header: 'Agregar empresa',
      width: '36rem',
      data: { company },
      modal: true,
    });
  }

  deleteCompany(id: string) {
    this.store.deleteItem(id);
  }
}
