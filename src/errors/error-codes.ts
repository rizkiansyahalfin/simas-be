export const ErrorCodes = {

  INVENTORY_NOT_FOUND: {
    status: 404,
    message: "Inventory not found"
  },

  CONGREGATION_NOT_FOUND: {
    status: 404,
    message: "Congregation not found"
  },

  SESSION_NOT_FOUND: {
    status: 404,
    message: "Attendance session not found"
  },

  DONATION_NOT_FOUND: {
    status: 404,
    message: "Donation not found"
  },

  CAMPAIGN_NOT_FOUND: {
    status: 404,
    message: "Campaign not found"
  },

  ALREADY_CHECKED_IN: {
    status: 409,
    message: "Already checked in"
  },

  INVALID_CREDENTIALS: {
    status: 401,
    message: "Invalid credentials"
  },

  FORBIDDEN: {
    status: 403,
    message: "Access denied"
  },

  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal server error"
  }
} as const