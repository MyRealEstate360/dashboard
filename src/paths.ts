export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    properties: '/dashboard/properties',
    tenants: '/dashboard/tenants',
    renting: '/dashboard/renting',
    expenses: '/dashboard/expenses',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
