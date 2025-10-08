
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session:', error);
        }
        
        if (initialSession) {
          // Check if session is still valid
          const now = Math.floor(Date.now() / 1000);
          if (initialSession.expires_at && now < initialSession.expires_at) {
            setSession(initialSession);
            setUser(initialSession.user);
            logger.debug('Session restored');
          } else {
            logger.info('Session expired, attempting refresh');
            // Try to refresh the session
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              logger.error('Failed to refresh session:', refreshError);
              // Clear invalid session
              setSession(null);
              setUser(null);
            }
          }
        }
      } catch (error) {
        logger.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state change:', event);
        
        // Handle email verification success
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          logger.info('User email verified successfully');
          toast({
            title: 'Email verified!',
            description: 'Your email has been verified. You can now log in.',
          });
        }
        
        // Handle email verification
        if (event === 'TOKEN_REFRESHED' && session?.user?.email_confirmed_at) {
          logger.info('User email verified and token refreshed');
        }

        // Handle sign in
        if (event === 'SIGNED_IN') {
          logger.info('User signed in');
        }

        // Handle sign out
        if (event === 'SIGNED_OUT') {
          logger.info('User signed out');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only set loading to false for initial auth state changes
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => subscription.unsubscribe();
  }, [toast]);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Always use production URL for email verification since users will click from their email
    // This ensures verification links work regardless of where the signup was initiated from
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://nutri-kid.vercel.app';
    const redirectUrl = `${baseUrl}/verify`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return { error };
      }
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      return { error: null };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
