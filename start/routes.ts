/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const OnboardingController = () => import('#controllers/onboardings_controller')

import router from '@adonisjs/core/services/router'

router.get('/login', [AuthController, 'showLogin'])
router.post('/login', [AuthController, 'login'])

router.get('/register', [AuthController, 'showRegister'])
router.post('/register', [AuthController, 'register'])

router.get('/logout', [AuthController, 'logout'])

router
  .group(() => {
    router.on('/').renderInertia('home')
  })
  .use([middleware.auth(), middleware.userOnboarding(), middleware.currentProjectLoader()])

router
  .group(() => {
    router.get('/onboarding', [OnboardingController, 'showOnboarding'])
    router.post('/onboarding', [OnboardingController, 'submitOnboarding'])
  })
  .use([middleware.auth()])
