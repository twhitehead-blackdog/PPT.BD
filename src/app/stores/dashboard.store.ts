import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { differenceInMonths, getMonth } from 'date-fns';
import { Branch } from '../models';
import { AuthStore } from './auth.store';
import { BanksStore } from './banks.store';
import { BranchesStore } from './branches.store';
import { CompaniesStore } from './companies.store';
import { DepartmentsStore } from './departments.store';
import { EmployeesStore } from './employees.store';
import { PayrollsStore } from './payrolls.store';
import { PositionsStore } from './positions.store';
import { SchedulesStore } from './schedules.store';

type State = {
  selectedCompanyId: string | null;
  currentEmployeeId?: string | null;
};

const initialState: State = {
  selectedCompanyId: null,
  currentEmployeeId: null,
};

export const DashboardStore = signalStore(
  withState(initialState),
  withProps(() => ({
    companies: inject(CompaniesStore),
    employees: inject(EmployeesStore),
    branches: inject(BranchesStore),
    positions: inject(PositionsStore),
    departments: inject(DepartmentsStore),
    schedules: inject(SchedulesStore),
    auth: inject(AuthStore),
    banks: inject(BanksStore),
    payrolls: inject(PayrollsStore),
  })),
  withComputed(
    ({ employees, branches, companies, selectedCompanyId, auth }) => {
      const headCount = computed(
        () => employees.entities().filter((x) => x.is_active).length
      );

      const currentEmployee = computed(() =>
        employees.entities().find((x) => x.id === auth.currentEmployeeId())
      );

      const monthlyBudget = computed(() =>
        employees
          .employeesList()
          .filter((x) => x.is_active)
          .reduce((acc, current) => acc + current.monthly_salary, 0)
      );

      const isAdmin = computed(() => currentEmployee()?.position?.admin);
      const isScheduleAdmin = computed(
        () => currentEmployee()?.position?.schedule_admin
      );
      const isScheduleApprover = computed(
        () => currentEmployee()?.position?.schedule_approver
      );

      const currentBranch = computed(() => currentEmployee()?.branch);

      const branchesCount = computed(
        () => branches.entities().filter((x) => x.is_active).length
      );

      const selectedCompany = computed(() =>
        companies.entities().find((x) => x.id === selectedCompanyId())
      );

      const employeesByGender = computed(() =>
        employees.entities().reduce<
          {
            gender: string;
            count: number;
          }[]
        >((acc, item) => {
          const index = acc.findIndex((x) => x.gender === item.gender);
          if (index !== -1) {
            acc[index].count++;
          } else {
            acc.push({ gender: item.gender, count: 1 });
          }
          return acc;
        }, [])
      );

      const countByGender = computed(() =>
        employees
          .entities()
          .filter((x) => x.is_active)
          .reduce((acc, item) => {
            acc[item.gender] = (acc[item.gender] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
      );

      const birthDates = computed(() =>
        employees
          .entities()
          .filter((x) => x.is_active)
          .filter(
            (x) =>
              x.birth_date &&
              (x.birth_date as unknown as string) !== '1970-01-01'
          )
          .filter((x) => getMonth(x.birth_date!) === getMonth(new Date()))
          .sort(
            (a, b) =>
              new Date(a.birth_date!).getDate() -
              new Date(b.birth_date!).getDate()
          )
          .map(({ first_name, father_name, birth_date, branch }) => ({
            first_name,
            father_name,
            birth_date,
            branch,
          }))
      );

      const employeesByBranch = computed(() =>
        employees
          .employeesList()
          .filter((x) => x.is_active)
          .reduce<
            {
              branch: Branch | undefined;
              count: number;
            }[]
          >((acc, item) => {
            const itemIndex = acc.findIndex(
              (x) => x.branch?.id === item.branch_id
            );
            if (itemIndex !== -1) {
              acc[itemIndex].count++;
            } else {
              acc.push({ branch: item.branch, count: 1 });
            }
            return acc;
          }, [])
      );

      const employeesList = computed(() =>
        employees.entities().map((item) => ({
          ...item,
          full_name: `${item.first_name} ${item.middle_name} ${item.father_name} ${item.mother_name}`,
          short_name: `${item.first_name} ${item.father_name}`,
          months: differenceInMonths(new Date(), item.start_date ?? new Date()),
          probatory:
            differenceInMonths(new Date(), item.start_date ?? new Date()) < 3,
        }))
      );

      return {
        headCount,
        employeesList,
        branchesCount,
        employeesByBranch,
        employeesByGender,
        birthDates,
        selectedCompany,
        currentEmployee,
        isAdmin,
        isScheduleAdmin,
        isScheduleApprover,
        currentBranch,
        monthlyBudget,
        countByGender,
      };
    }
  ),
  withMethods((state) => ({
    toggleCompany: (id: string | null) =>
      patchState(state, { selectedCompanyId: id }),
  }))
);
