const routes = {
  // Public
  HOME: '/',
  INTRODUCE: '/introduce',
  PRIVACY: '/privacy',

  // Auth
  LOGIN: '/sign-in',
  REGISTER: '/sign-up',
  FORGOTTEN: '/forgotten',
  VERIFYCODE: '/verify-code',
  CHANGEPASSWORD: '/change-password',

  // Private

  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Manage
  DASHBOARD: '/admin',
  ACCOUNT: '/admin-accounts',
  PRODUCT: '/admin-products',
  ORDER: '/admin-orders',
  DELETEPRODUCT: '/admin-delete-products',
  // BOOK
  ALLBOOK: '/all-book',
  CUSTOMERHISTORY: '/customer-history',
  // RECOMMEND BOOK
  RECOMMEND: '/recommend'
};

export default routes;
