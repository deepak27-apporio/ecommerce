export const success = (data: any, message = "Success") => ({ success: true, message, data });
export const error = (message = "Error") => ({ success: false, message });

export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};