// Simple validation schemas
export const authValidation = {
  register: {
    validate: (data: any) => ({ error: null, value: data })
  },
  login: {
    validate: (data: any) => ({ error: null, value: data })
  }
};