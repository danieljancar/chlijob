import { AuthError } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/postgrest-js';

export function mapAuthError(error: AuthError): string {
  const code = (error as unknown as { code?: string }).code;

  switch (code) {
    case 'invalid_credentials':
      return 'AUTH_ERROR.INVALID_CREDENTIALS';
    case 'email_not_confirmed':
      return 'AUTH_ERROR.EMAIL_NOT_CONFIRMED';
    case 'user_already_exists':
    case 'email_exists':
      return 'AUTH_ERROR.USER_ALREADY_EXISTS';
    case 'weak_password':
      return 'AUTH_ERROR.WEAK_PASSWORD';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'AUTH_ERROR.RATE_LIMIT';
    case 'email_address_invalid':
      return 'AUTH_ERROR.EMAIL_INVALID';
    case 'signup_disabled':
      return 'AUTH_ERROR.SIGNUP_DISABLED';
  }

  const msg = (error.message ?? '').toLowerCase();
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'AUTH_ERROR.INVALID_CREDENTIALS';
  }
  if (msg.includes('email not confirmed')) return 'AUTH_ERROR.EMAIL_NOT_CONFIRMED';
  if (msg.includes('already registered') || msg.includes('user already')) {
    return 'AUTH_ERROR.USER_ALREADY_EXISTS';
  }
  if (msg.includes('rate limit') || msg.includes('only request this once')) {
    return 'AUTH_ERROR.RATE_LIMIT';
  }
  if (msg.includes('network') || msg.includes('failed to fetch')) {
    return 'AUTH_ERROR.NETWORK';
  }

  return 'AUTH_ERROR.UNKNOWN';
}

export function mapPostgrestError(error: PostgrestError): string {
  switch (error.code) {
    case '23505':
      return 'AUTH_ERROR.DUPLICATE'; // unique_violation
    case '42501':
      return 'AUTH_ERROR.FORBIDDEN'; // insufficient_privilege (RLS block)
    default:
      return 'AUTH_ERROR.UNKNOWN';
  }
}
