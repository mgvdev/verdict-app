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
const RulesController = () => import('#controllers/rules_controller')

import router from '@adonisjs/core/services/router'
const RuleChecksController = () => import('#controllers/rule_checks_controller')
const ApiKeysController = () => import('#controllers/api_keys_controller')

/**
 * Frontend routes
 * Initialize the middleware for inertia and flash message
 * Please respect the order of the middleware
 */
router
  .group(() => {
    router.get('/login', [AuthController, 'showLogin'])
    router.post('/login', [AuthController, 'login'])

    router.get('/register', [AuthController, 'showRegister'])
    router.post('/register', [AuthController, 'register'])

    router.get('/logout', [AuthController, 'logout'])

    /**
     * Authenticated and onboarded routes
     */
    router
      .group(() => {
        /**
         * Home route
         */
        router.on('/').renderInertia('home')

        /**
         * Rules routes
         */
        router
          .group(() => {
            router.get('/', [RulesController, 'index'])
            router.post('/', [RulesController, 'store'])

            router.get('/create', [RulesController, 'create'])
            router.get('/:id', [RulesController, 'show'])
            router.patch('/:id', [RulesController, 'update'])
          })
          .prefix('/rules')

        router
          .group(() => {
            router.get('/', [ApiKeysController, 'index'])
            router.post('/api_key', [ApiKeysController, 'store'])
          })
          .prefix('/api_management')
      })
      .use([middleware.auth(), middleware.userOnboarding(), middleware.currentProjectLoader()])

    /**
     * Onboarding routes
     */
    router
      .group(() => {
        router.get('/onboarding', [OnboardingController, 'showOnboarding'])
        router.post('/onboarding', [OnboardingController, 'submitOnboarding'])
      })
      .use([middleware.auth()])
  })
  .use([middleware.inertia(), middleware.flashMessage()])

/**
 * Api route
 */
router
  .group(() => {
    router.post('/test', () => {
      return {
        message: 'Hello world',
      }
    })

    router
      .post('/rules/:ruleId/evaluate', [RuleChecksController, 'checkRule'])
      .middleware([middleware.apiLog()])
  })
  .use([middleware.apiAuth()])
  .domain('api.localhost')
