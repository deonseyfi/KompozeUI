import React, { useState } from 'react';
import { Alert, Button, Box } from '@mui/material';
import { useAuth } from '../../ProfilePage/Components/AuthContext';

const EmailVerifBanner: React.FC = () => {
  const { user, resendVerificationEmail, loading } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Don't show banner while auth is still loading
  if (loading) {
    return null;
  }

  // Only show banner if user is logged in with email/password and not verified
  if (!user || user.emailVerified || user.provider !== 'email') {
    return null;
  }

  const handleResendEmail = async () => {
    setButtonLoading(true);
    try {
      await resendVerificationEmail();
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000); // Hide message after 5 seconds
    } catch (error) {
      console.error('Error sending verification email:', error);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Alert 
        severity="warning" 
        sx={{ 
          borderRadius: 0,
          backgroundColor: 'rgba(255, 102, 0, 0.9)',
          color: 'white',
          '& .MuiAlert-icon': { color: 'white' }
        }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={handleResendEmail}
            disabled={buttonLoading || emailSent}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            {emailSent ? 'Email Sent!' : 'Resend Email'}
          </Button>
        }
      >
        Please verify your email address. Check your inbox for a verification link.
      </Alert>
    </Box>
  );
};

export default EmailVerifBanner;