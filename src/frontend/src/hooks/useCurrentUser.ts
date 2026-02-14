import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile } from './useQueries';

export function useCurrentUser() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity && loginStatus === 'success';

  return {
    identity,
    userProfile,
    isAuthenticated,
    isLoading: profileLoading,
    isFetched,
    needsProfile: isAuthenticated && isFetched && userProfile === null,
  };
}
