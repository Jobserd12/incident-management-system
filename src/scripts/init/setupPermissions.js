import mongoose from 'mongoose';
import { PERMISSIONS, ROLES } from '../../config/permissions.js';
import Permission from '../../models/permission.model.js';
import Role from '../../models/role.model.js';

export async function setupPermissionsAndRoles() {
  try {
    // Crear permisos
    const permissionPromises = Object.values(PERMISSIONS).map(async (permission) => {
      return Permission.findOneAndUpdate(
        { name: permission.name },
        permission,
        { upsert: true, new: true }
      );
    });
    
    const createdPermissions = await Promise.all(permissionPromises);
    
    // Crear roles
    const rolePromises = Object.values(ROLES).map(async (roleData) => {
      const permissions = createdPermissions.filter(p => 
        roleData.permissions.includes(p.name)
      );
      
      return Role.findOneAndUpdate(
        { name: roleData.name },
        {
          ...roleData,
          permissions: permissions.map(p => p._id),
          isSystem: true
        },
        { upsert: true, new: true }
      );
    });
    
    await Promise.all(rolePromises);
    
    console.log('✅ Permisos y roles inicializados correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar permisos y roles:', error);
    throw error;
  }
} 