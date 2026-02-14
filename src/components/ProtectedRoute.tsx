import { Navigate } from 'react-router-dom';
import { userSession } from '@/lib/stacks-auth';
import { useUser } from '@/hooks/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * 
 * Redirects to landing page if:
 * - User is not signed in
 * - User doesn't have an account in Supabase
 * 
 * Only allows access if user is authenticated and has account
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const isSignedIn = userSession.isUserSignedIn();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  // Redirect to landing if not authenticated
  if (!isSignedIn || !user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

