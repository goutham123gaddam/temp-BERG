import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { login, signup, clearError, setAuth, logout } from '../features/auth/authSlice';

export const useAuth = () => {
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const loginUser = async (email: string, password: string) => {
    return await dispatch(login({ email, password }));
  };

  const signupUser = async (email: string, password: string) => {
    return await dispatch(signup({ email, password }));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const getToken = () => {
    const localUserStorageToken = localStorage.getItem('user')
    const userParseData = localUserStorageToken ? JSON.parse(localUserStorageToken) : null
    dispatch(setAuth(userParseData))
    return userParseData
  }

  const validateToken = () => {
    try {
      let token = user
      if (!token) {
        token = getToken()
      }
      // Ensure token is an object and has access_token property
      if (!token || typeof token !== 'object' || !('access_token' in token)) {
        throw new Error('Invalid Token');
      }

      const { expires_at } = token
      if (expires_at < (Date.now() / 1000)) {
        throw new Error('Token Expired')
      }

      return token
    } catch (err) {
      
      console.log(err)
      dispatch(logout())
      return null
    }

  }

  return { user, loading, error, loginUser, signupUser,logoutUser, clearAuthError, getToken, validateToken };
};
