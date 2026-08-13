
'use client';

import { useAuth } from '@/auth/use-auth';
import { hasPermission } from '@/auth/authorization';

export function Can({
    permission,
    children,
    fallback = null,
}) {
    const { user } = useAuth();

    if (!hasPermission(user, permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}