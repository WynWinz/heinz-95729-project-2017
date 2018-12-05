module.exports = {
  scope: 'heinz',
  name: 'checkoutController',
  dependencies: ['router', 'checkoutComponent', 'ShoppingCart'],
  factory: (router, checkoutComponent, shoppingCart) => {
    'use strict'

    /**
     * A view model for the products in the shopping cart (an array of products)
     * @param {Array} products - the products in shopping cart
     */
    function CartResult (shoppingCart) {
      // Spread set into array.
      const products = [...shoppingCart.getItems()]
      const subtotal = shoppingCart.getSubtotal()

      return {
        products,
        subtotal,
        shoppingCart
      }
    }

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/checkout', (context) => {
        app.currentView = 'loading'
        checkoutComponent.setCart(new CartResult(shoppingCart))
        app.currentView = 'checkout'
      })
    }

    return { registerRoutes }
  }
}
