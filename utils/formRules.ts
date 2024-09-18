export const nameRules = [
  (v) => !!v || "Name is required",
  (v) => (v && v.length <= 100) || "Name must be less than 100 characters",
]

export const usernameRules = [
  (v) => !!v || "Username is required",
  (v) => (v && v.length <= 50) || "Username must be less than 50 characters",
]
export const emailRules = [
  (v) => !!v || "Email is required",
  (v) => (v && v.length <= 50) || "Email must be less than 50 characters",
  (v) => /.+@.+\..+/.test(v) || "Email must be valid",
]
export const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => (v && v.length <= 20) || "Password must be less than 20 characters",
]
export const addressRules = [
  (v) => (v && v.length <= 50) || "Address must be less than 50 characters",
]
export const newUsernameRules = [
  (v) => (v && v.length <= 50) || "Username must be less than 50 characters",
]
