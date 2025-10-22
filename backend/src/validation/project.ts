// Simple validation schemas for projects
export const projectValidation = {
  create: {
    validate: (data: any) => ({ error: null, value: data })
  },
  update: {
    validate: (data: any) => ({ error: null, value: data })
  }
};