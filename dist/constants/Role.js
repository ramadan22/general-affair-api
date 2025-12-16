export var Role;
(function (Role) {
    Role["STAFF"] = "STAFF";
    Role["GA"] = "GA";
    Role["COORDINATOR"] = "COORDINATOR";
    Role["LEAD"] = "LEAD";
    Role["MANAGER"] = "MANAGER";
})(Role || (Role = {}));
export const RoleLabel = {
    [Role.STAFF]: 'Staff',
    [Role.GA]: 'General Affairs',
    [Role.COORDINATOR]: 'Coordinator',
    [Role.LEAD]: 'Team Lead',
    [Role.MANAGER]: 'Manager',
};
