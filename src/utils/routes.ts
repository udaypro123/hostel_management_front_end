// Simple routing constants for easy navigation
export const ROUTES = {
  // Auth Routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Dashboard Routes
  DASHBOARD: '/dashboard',
  
  // Hostel Routes
  HOSTELS: '/hostels',
  HOSTEL_ADD: '/hostels/add',
  HOSTEL_DETAILS: (id: string) => `/hostels/${id}`,
  
  // Warden Routes
  WARDENS: '/wardens',
  WARDEN_ADD: '/wardens/add',
  WARDEN_DETAILS: (id: string) => `/wardens/${id}`,
  WARDEN_EDIT: (id: string) => `/wardens/${id}/edit`,
  
  // Room Routes
  ROOM_ADD: '/rooms/add',
  
  // Other Routes
  ANNOUNCEMENTS: '/announcements',
} as const;

// Navigation helper functions
export const navigateTo = {
  login: () => ROUTES.LOGIN,
  signup: () => ROUTES.SIGNUP,
  dashboard: () => ROUTES.DASHBOARD,
  hostels: () => ROUTES.HOSTELS,
  addHostel: () => ROUTES.HOSTEL_ADD,
  hostelDetails: (id: string) => ROUTES.HOSTEL_DETAILS(id),
  wardens: () => ROUTES.WARDENS,
  addWarden: () => ROUTES.WARDEN_ADD,
  wardenDetails: (id: string) => ROUTES.WARDEN_DETAILS(id),
  editWarden: (id: string) => ROUTES.WARDEN_EDIT(id),
  addRoom: () => ROUTES.ROOM_ADD,
  announcements: () => ROUTES.ANNOUNCEMENTS,
};

// Route matching helper for checking active routes
export const isActiveRoute = (currentPath: string, targetPath: string): boolean => {
  if (targetPath === ROUTES.DASHBOARD) {
    return currentPath === targetPath;
  }
  return currentPath.startsWith(targetPath);
};
