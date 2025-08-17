import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const registerValidationMessages = {
  'email.required': 'Email is required',
  'email.email': 'Email is not valid',
  'email.unique': 'Email already exists',
  'password.required': 'Password is required',
  'password.minLength': 'Password must be at least 8 characters',
  'password.regex':
    'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  'password_confirmation.required': 'Password confirmation is required',
  'password_confirmation.confirmed': 'Password and password confirmation must match',
  'accept_terms.required': 'You must accept the terms and conditions',
  'accept_terms.accepted': 'You must accept the terms and conditions',
}

vine.messagesProvider = new SimpleMessagesProvider(registerValidationMessages)

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value, _) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    // https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet#Using_a_Rfc_Compliant_Regular_Expression_to_Validate_a_Password
    // at least one uppercase letter, one lowercase letter, one digit, and one special character
    // minimum length of 8 characters
    password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    password_confirmation: vine.string().confirmed({ confirmationField: 'password' }),
    accept_terms: vine.accepted(),
  })
)
