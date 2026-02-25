import * as yup from "yup";

//-------------------------------------------------------------------------------------//
export const loginForm = yup.object({
  email: yup.string().email("Invalid email").required("This field is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("This field is required"),
});
//-------------------------------------------------------------------------------------//

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required("This field is required"),
  email: yup.string().email("Invalid email").required("This field is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("This field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});
//-------------------------------------------------------------------------------------//

export const forgetForm = yup.object({
  email: yup.string().email("Invalid email").required("This field is required"),
});

export const forgetChangeCode = yup.object({
  code: yup.number().min(6, "Code must be at least 6 digits"),
});

export const changePassword = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("This field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});
//-------------------------------------------------------------------------------------//
export const changeAccount = yup.object({
  userName: yup.string().min(3, "Username must be at least 3 characters"),
  email: yup.string().email("Invalid email"),
});
