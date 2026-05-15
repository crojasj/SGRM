export const ROLES = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  TECHNICIAN: 'Técnico',
  PURCHASING: 'Adquisiciones'
};

export const canAccessInventory = (role) => {
  return [ROLES.ADMIN, ROLES.PURCHASING, ROLES.TECHNICIAN].includes(role);
};

export const canManageMaintenances = (role) => {
  return [ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.TECHNICIAN].includes(role);
};

export const canManageUsers = (role) => {
  return role === ROLES.ADMIN;
};
