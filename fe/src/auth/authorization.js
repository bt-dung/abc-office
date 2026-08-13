export function hasPermission(user, requiredPermissions) {
    if (!user || !user.permissions || user.permissions.length === 0) {
        return false;
    }
    const userPermissions = new Set(user.permissions.map(p => p.name));

    if (Array.isArray(requiredPermissions)) {
        if (requiredPermissions.length === 0) {
            return true;
        }
        return requiredPermissions.some(p => userPermissions.has(p));
    }

    return userPermissions.has(requiredPermissions);
}
