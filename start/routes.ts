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
const BillingsController = () => import('#controllers/billings_controller')
const SubscriptionsController = () => import('#controllers/subscriptions_controller')
const ActivitiesController = () => import('#controllers/activities_controller')
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
        router.on('/').renderInertia('home').as('home')

        /**
         * Rules routes
         */
        router
          .group(() => {
            router.get('/', [RulesController, 'index']).as('rules.index')
            router.post('/', [RulesController, 'store']).as('rules.store')

            router.get('/create', [RulesController, 'create'])
            router.get('/:id', [RulesController, 'show'])
            router.patch('/:id', [RulesController, 'update'])
            router.delete('/:id', [RulesController, 'destroy'])
          })
          .prefix('/rules')

        /**
         * Api management routes
         */
        router
          .group(() => {
            router.get('/', [ApiKeysController, 'index'])
            router.post('/api_key', [ApiKeysController, 'store'])
            router.delete('/api_key/:id', [ApiKeysController, 'revoke'])
          })
          .prefix('/api_management')

        /**
         * Activities routes
         */
        router
          .group(() => {
            router.get('/', [ActivitiesController, 'index'])
          })
          .prefix('/activities')

        /**
         * Billing and subscription routes
         */
        router
          .group(() => {
            router.get('/', [BillingsController, 'index']).as('billing.index')

            router.get('/subscribe', [SubscriptionsController, 'subscribe'])
            router
              .get('/new_subscription/checkout_success', [SubscriptionsController, 'success'])
              .as('billing.checkout_success')
            router
              .get('/new_subscription/checkout_cancel', [SubscriptionsController, 'cancel'])
              .as('billing.checkout_cancel')
          })
          .prefix('/billing')
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
  .use([
    middleware.bodyParser(),
    middleware.bouncer(),
    middleware.inertia(),
    middleware.flashMessage(),
  ])

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
      .middleware([middleware.apiLog(), middleware.apiLimitCheck()])
  })
  .use([middleware.bodyParser(), middleware.apiAuth()])
  .domain('api.localhost')
