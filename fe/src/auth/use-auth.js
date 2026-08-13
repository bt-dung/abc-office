'use client';

import { createContext, useContext } from 'react';

/**
 * @typedef {import('@/lib/dal').UserSession} UserSession
 * @typedef {{ user: UserSession | null }} AuthContextType
 */

// 1. Tạo context với giá trị mặc định là null
const AuthContext = createContext(/** @type {AuthContextType | null} */(null));

// 2. Tạo Provider component để bao bọc ứng dụng và cung cấp dữ liệu user
export function AuthProvider({ user, children }) {
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

// 3. Tạo custom hook để các component con có thể dễ dàng lấy dữ liệu user
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error('useAuth() phải được sử dụng bên trong một AuthProvider.');
    }

    return context;
}