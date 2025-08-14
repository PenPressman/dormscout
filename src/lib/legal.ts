// Legal version constants
export const LEGAL_TOS_VERSION = "2025-01-01";
export const LEGAL_PRIVACY_VERSION = "2025-01-01";

// Helper function to check if user needs re-consent
export const needsReconsent = (
  userTosVersion?: string | null,
  userPrivacyVersion?: string | null
): boolean => {
  return (
    userTosVersion !== LEGAL_TOS_VERSION ||
    userPrivacyVersion !== LEGAL_PRIVACY_VERSION
  );
};