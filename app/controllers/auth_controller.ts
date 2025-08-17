import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from '#validators/auth/register'
import User from '#models/user'

export default class AuthController {
  public async showLogin({ inertia, auth }: HttpContext) {
    if (auth.user) {
      return inertia.render('dashboard')
    }
    return inertia.render('auth/login')
  }

  public async login({ request, response, inertia }: HttpContext) {
    const { email, password } = request.all()
    try {
      await User.verifyCredentials(email, password)
      return response.redirect('/')
    } catch (error) {
      console.log(error)
      return inertia.render('auth/login', {
        errors: {
          message: 'Invalid email or password',
        },
      })
    }
  }

  public async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Register
   * @param request
   * @param auth
   * @param response
   * @param inertia
   */
  public async register({ request, auth, response, inertia }: HttpContext) {
    /**
     * Validate the request
     */
    const payload = await request.validateUsing(registerValidator)

    /**
     * Create the user
     * and login if successful
     */
    try {
      const newUser = await User.create({
        email: payload.email,
        password: payload.password,
      })

      await auth.use('web').login(newUser)

      return response.redirect('/')
    } catch (error) {
      return inertia.render('auth/register', {
        errors: {
          message: error.message,
        },
      })
    }
  }

  /**
   * Logout
   * @param auth
   * @param response
   */
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
