export interface UserData {
  user?: {
    email?: string;
    raw_user_meta_data?: {
      role?: string;
    };
    user_metadata?: {
      role?: string;
    };
  };
}

/**
 * Extract user role from Supabase user data
 */
export const getUserRole = (userData: UserData | null): string => {
  if (!userData?.user) {
    return 'annotator'; // Default fallback
  }

  // Check role in raw_user_meta_data (your format)
  const role = userData.user.raw_user_meta_data?.role || 
               userData.user.user_metadata?.role ||
               'annotator'; // Default to annotator

  return role;
};

/**
 * Extract display name from email (everything before @)
 */
export const getUserDisplayName = (userData: UserData | null): string => {
  if (!userData?.user?.email) {
    return 'User';
  }
  return userData.user.email.split('@')[0];
};

/**
 * Get current user data from localStorage
 */
export const getCurrentUserData = (): UserData | null => {
  try {
    const userDataString = localStorage.getItem('user');
    return userDataString ? JSON.parse(userDataString) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * Get current user role from localStorage
 */
export const getCurrentUserRole = (): string => {
  const userData = getCurrentUserData();
  return getUserRole(userData);
};

/**
 * Get current user display name from localStorage (email prefix)
 */
export const getCurrentUserName = (): string => {
  const userData = getCurrentUserData();
  return getUserDisplayName(userData);
};

/**
 * Check if current user has admin privileges
 */
export const isAdmin = (): boolean => {
  return getCurrentUserRole() === 'admin';
};

/**
 * Check if current user is an annotator
 */
export const isAnnotator = (): boolean => {
  return getCurrentUserRole() === 'annotator';
};

/**
 * Debug function to log user role detection process
 */
export const debugUserRole = (): void => {
  const userData = getCurrentUserData();
  
  console.log('🔍 User Role Debug Information:', {
    hasUserData: !!userData,
    email: userData?.user?.email,
    raw_user_meta_data_role: userData?.user?.raw_user_meta_data?.role,
    user_metadata_role: userData?.user?.user_metadata?.role,
    detected_role: getUserRole(userData),
    detected_name: getUserDisplayName(userData)
  });
};