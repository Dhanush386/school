/**
 * permissions/index.js
 * Centralized role-based permissions module for School ERP.
 * All role constants and permission sets are defined here so that
 * middleware and controllers can import from a single source of truth.
 */

const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  PRINCIPAL: 'principal',
  ADMIN: 'admin',
  COORDINATOR: 'coordinator',
  HOD: 'hod',
};

/**
 * Permission map.
 * Each key is a permission name; the value is the array of roles that hold it.
 */
const permissions = {
  canApproveQuestions:  [ROLES.PRINCIPAL, ROLES.ADMIN],
  canEditFees:          [ROLES.ADMIN],
  canViewAllComplaints: [ROLES.PRINCIPAL, ROLES.ADMIN, ROLES.COORDINATOR],
  canManageHostel:      [ROLES.ADMIN],
  canMarkAttendance:    [ROLES.TEACHER, ROLES.PRINCIPAL, ROLES.ADMIN, ROLES.COORDINATOR],
  canManageLibrary:     [ROLES.ADMIN],
  canManageTransport:   [ROLES.ADMIN],
  canViewReports:       [ROLES.PRINCIPAL, ROLES.ADMIN, ROLES.COORDINATOR],
  canManageUsers:       [ROLES.ADMIN],
  canCreateCirculars:   [ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.COORDINATOR],
};

/**
 * Checks whether a given role has a specific permission.
 * @param {string} role       - One of the ROLES values.
 * @param {string} permission - Key of the permissions map.
 * @returns {boolean}
 */
const hasPermission = (role, permission) => {
  return !!(permissions[permission] && permissions[permission].includes(role));
};

module.exports = { ROLES, permissions, hasPermission };
