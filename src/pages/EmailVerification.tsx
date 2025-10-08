import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have verification parameters in the URL
    const code = searchParams.get('code');
    const next = searchParams.get('next');

    if (code) {
      // This means the user clicked the verification link
      // Supabase will handle the verification automatically
      setVerificationStatus('success');
      
      toast({
        title: 'Email verified successfully!',
        description: 'Your account has been verified. You can now log in.',
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } else if (user?.email_confirmed_at) {
      // User is already verified
      setVerificationStatus('success');
    } else {
      // No verification code, show error
      setVerificationStatus('error');
    }
  }, [searchParams, user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Verification Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <Mail className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold text-red-800 mb-2">
                Verification Link Invalid
              </h3>
              <p className="text-red-700 text-sm">
                The verification link appears to be invalid or has expired.
              </p>
            </div>
            <Button
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-green-600">Email Verified!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-green-800 mb-2">
              Verification Successful!
            </h3>
            <p className="text-green-700 text-sm">
              Your email has been verified successfully.
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <p>You will be redirected to the login page shortly...</p>
          </div>
          <Button
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            Go to Login Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
