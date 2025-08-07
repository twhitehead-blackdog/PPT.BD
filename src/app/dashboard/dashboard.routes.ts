import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((x) => x.DashboardComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home.component').then((x) => x.HomeComponent),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./admin.component').then((x) => x.AdminComponent),
        children: [
          {
            path: 'employees',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./employee-list.component').then(
                    (x) => x.EmployeeListComponent
                  ),
              },
              {
                path: 'new',
                loadComponent: () =>
                  import('./employee-form.component').then(
                    (x) => x.EmployeeFormComponent
                  ),
              },
              {
                path: ':employee_id',
                loadComponent: () =>
                  import('./employee-detail.component').then(
                    (x) => x.EmployeeDetailComponent
                  ),
              },

              {
                path: ':employee_id/edit',
                loadComponent: () =>
                  import('./employee-form.component').then(
                    (x) => x.EmployeeFormComponent
                  ),
              },
            ],
          },
          {
            path: 'companies',
            loadComponent: () =>
              import('./companies.component').then((x) => x.CompaniesComponent),
          },
          {
            path: 'departments',
            loadComponent: () =>
              import('./departments.component').then(
                (x) => x.DepartmentsComponent
              ),
          },
          {
            path: 'positions',
            loadComponent: () =>
              import('./positions.component').then((x) => x.PositionsComponent),
          },
          {
            path: 'branches',
            loadComponent: () =>
              import('./branches.component').then((x) => x.BranchesComponent),
          },
          { path: '', redirectTo: 'employees', pathMatch: 'full' },
        ],
      },
      {
        path: 'time-management',
        loadComponent: () =>
          import('./time-management.component').then(
            (x) => x.TimeManagementComponent
          ),
        children: [
          {
            path: 'timelogs',
            loadComponent: () =>
              import('./timelogs.component').then((x) => x.TimelogsComponent),
          },
          {
            path: 'timetables',
            loadComponent: () =>
              import('./employees-timetable.component').then(
                (x) => x.EmployeesTimetableComponent
              ),
          },

          {
            path: 'schedules',
            loadComponent: () =>
              import('./schedules.component').then((x) => x.SchedulesComponent),
          },

          {
            path: 'shifts',
            loadComponent: () =>
              import('./shifts.component').then((x) => x.ShiftsComponent),
          },
          { path: '', redirectTo: 'timetables', pathMatch: 'full' },
        ],
      },
      {
        path: 'payroll',
        loadComponent: () =>
          import('./payroll.component').then((x) => x.PayrollComponent),
        children: [
          {
            path: 'payrolls',
            loadComponent: () =>
              import('./payrolls.component').then((x) => x.PayrollsComponent),
          },
          {
            path: 'payrolls/:payroll_id',
            loadComponent: () =>
              import('./payrolls-details.component').then(
                (x) => x.PayrollsDetailsComponent
              ),
          },
          {
            path: 'payrolls/:payroll_id/payments/:payment_id',
            loadComponent: () =>
              import('./payroll-payments-details.component').then(
                (x) => x.PayrollPaymentsDetailsComponent
              ),
          },
          {
            path: 'payrolls/:payroll_id/payments/:payment_id/draft',
            loadComponent: () =>
              import('./payroll-summary.component').then(
                (x) => x.PayrollSummaryComponent
              ),
          },
          {
            path: 'creditors',
            loadComponent: () =>
              import('./creditors.component').then((x) => x.CreditorsComponent),
          },
          {
            path: 'banks',
            loadComponent: () =>
              import('./banks.component').then((x) => x.BanksComponent),
          },
          { path: '', redirectTo: 'payrolls', pathMatch: 'full' },
        ],
      },
      {
        path: 'timeclock',
        loadComponent: () =>
          import('../timeclock.component').then((x) => x.TimeclockComponent),
      },
      { path: '', redirectTo: 'timeclock', pathMatch: 'full' },
    ],
  },
];
