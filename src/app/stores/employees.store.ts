import { computed } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { differenceInMonths } from 'date-fns';
import { exhaustMap } from 'rxjs';
import { Employee, Termination, TimeOff } from '../models';
import { withCustomEntities } from './entities.feature';

type State = {
  timeoff_types: TimeOff[];
};

export const EmployeesStore = signalStore(
  withState<State>({ timeoff_types: [] }),
  withCustomEntities<Employee>({
    name: 'employees',
    query:
      'id,first_name,middle_name,father_name,mother_name,birth_date,gender,start_date,monthly_salary,document_id,end_date,email,phone_number,is_active,uniform_size,company_id,branch_id,department_id,position_id,bank,account_number,bank_account_type,created_at,branch:branches(id, name, short_name),department:departments(id, name),position:positions(id, name, admin, schedule_admin, schedule_approver), address,work_email',
    detailsQuery:
      '*, branch:branches(*), department:departments(*), position:positions(*)',
  }),
  withComputed((state) => {
    const employeesList = computed(() =>
      state
        .entities()
        .map((item) => ({
          ...item,
          full_name: `${item.first_name} ${item.middle_name} ${item.father_name} ${item.mother_name}`,
          short_name: `${item.first_name} ${item.father_name}`,
          months: differenceInMonths(new Date(), item.start_date ?? new Date()),
          probatory:
            differenceInMonths(new Date(), item.start_date ?? new Date()) < 3,
        }))
        .sort((a, b) => a.full_name.localeCompare(b.full_name))
    );
    const activeEmployees = computed(() =>
      employeesList().filter((x) => x.is_active)
    );
    return {
      employeesList,
      activeEmployees,
    };
  }),
  withMethods((state) => ({
    terminateEmployee(request: Termination) {
      patchState(state, { isLoading: true, error: null });
      return state._http
        .post(
          `${process.env['ENV_SUPABASE_URL']}/rest/v1/terminations`,
          request
        )
        .pipe(
          exhaustMap(() =>
            state._http.patch(
              `${process.env['ENV_SUPABASE_URL']}/rest/v1/employees`,
              { is_active: false },
              {
                params: { id: `eq.${request.employee_id}` },
              }
            )
          ),
          tapResponse({
            next: () => {
              state._message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Empleado terminado exitosamente',
              });
            },
            error: (error) => {
              state._message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al terminar empleado',
              });
              patchState(state, { error });
            },
            finalize: () => patchState(state, { isLoading: false }),
          })
        );
    },
    saveTimeOff(request: TimeOff) {
      patchState(state, { isLoading: true, error: null });
      return state._http
        .post(`${process.env['ENV_SUPABASE_URL']}/rest/v1/timeoffs`, request)
        .pipe(
          tapResponse({
            next: () => {
              state._message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Solicitud de tiempo libre enviada',
              });
            },
            error: (error) => {
              state._message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al enviar solicitud de tiempo libre',
              });
              patchState(state, { error });
            },
            finalize: () => patchState(state, { isLoading: false }),
          })
        );
    },
    fetchTimeOffTypes() {
      patchState(state, { isLoading: true });
      return state._http
        .get<TimeOff[]>(
          `${process.env['ENV_SUPABASE_URL']}/rest/v1/timeoff_types`
        )
        .pipe(
          tapResponse({
            next: (items) => {
              patchState(state, { timeoff_types: items });
            },
            error: (error) => {
              state._message.add({
                severity: 'error',
                detail: 'Error al obtener tipos de tiempo libre',
                summary: 'Error',
              });
              console.error(error);
              throw error;
            },
            finalize: () => patchState(state, { isLoading: false }),
          })
        );
    },
  })),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
