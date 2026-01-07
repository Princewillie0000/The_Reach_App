export type UserRole = 'DEVELOPER' | 'CREATOR' | 'BUYER' | 'ADMIN';

export interface MockSession {
  userId: string;
  role: UserRole;
  name?: string;
  email?: string;
}

// Simple role switcher - can be toggled via query param ?role=ADMIN or localStorage
export function getMockSession(): MockSession {
  if (typeof window === 'undefined') {
    // Server-side: default to DEVELOPER
    return { userId: 'dev-1', role: 'DEVELOPER' };
  }

  // Check URL query param first
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role') as UserRole | null;
  
  if (roleParam && ['DEVELOPER', 'CREATOR', 'BUYER', 'ADMIN'].includes(roleParam)) {
    const session = { userId: `user-${roleParam.toLowerCase()}`, role: roleParam };
    localStorage.setItem('mockRole', roleParam);
    return session;
  }

  // Check localStorage
  const storedRole = localStorage.getItem('mockRole') as UserRole | null;
  if (storedRole && ['DEVELOPER', 'CREATOR', 'BUYER', 'ADMIN'].includes(storedRole)) {
    return { userId: `user-${storedRole.toLowerCase()}`, role: storedRole };
  }

  // Default: check if user is logged in from UserContext
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return {
        userId: user.id || 'dev-1',
        role: user.role === 'DEVELOPER' ? 'DEVELOPER' : user.role === 'CREATOR' ? 'CREATOR' : 'BUYER',
        name: user.name,
        email: user.email
      };
    } catch {
      // Fallback
    }
  }

  // Final fallback
  return { userId: 'dev-1', role: 'DEVELOPER' };
}

export function setMockRole(role: UserRole) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockRole', role);
    window.location.reload();
  }
}

