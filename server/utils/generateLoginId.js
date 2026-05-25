// Generates institutional login IDs like CSE021, TCH003, ADM001
const generateLoginId = (department, role, count) => {
  const prefixMap = {
    student: dept => dept.toUpperCase().slice(0, 3),
    teacher: () => 'TCH',
    principal: () => 'PRN',
    admin: () => 'ADM',
    coordinator: () => 'CRD',
    hod: dept => dept.toUpperCase().slice(0, 3) + 'H',
  };
  const prefix = prefixMap[role] ? prefixMap[role](department) : 'USR';
  const number = String(count).padStart(3, '0');
  return `${prefix}${number}`;
};
module.exports = generateLoginId;
