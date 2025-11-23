export enum Role {
  STAFF = 'STAFF',
  GA = 'GA',
  COORDINATOR = 'COORDINATOR',
  LEAD = 'LEAD',
  MANAGER = 'MANAGER'
}

export const RoleLabel: Record<Role, string> = {
  [Role.STAFF]: 'Staff',
  [Role.GA]: 'General Affairs',
  [Role.COORDINATOR]: 'Coordinator',
  [Role.LEAD]: 'Team Lead',
  [Role.MANAGER]: 'Manager',
};
