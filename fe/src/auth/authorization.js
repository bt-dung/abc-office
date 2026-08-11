export function hasPermission(user, permission) {
    if (!user) {
        return false;
    }

    return user.permissions.some(p => p.name === permission);
}

