# lightning-commerce
Lightning Commerce is a working prototype for a blazing fast ecommerce CMS, built on KOA for NodeJS.
## Check out the demo
Check out the demo [here](https://lightning-commerce.herokuapp.com/).
## Navigating the demo
Lightning Commerce is not currently production ready, but the demo gives you a good idea of what it's about and how it works. Opening the demo you will arrive on the *glass*, the customer facing website. Please note that this site, as well as the admin backoffice, are not yet mobile responsive.

You can switch from the glass to the backoffice via the link at the top right, and from the backoffice to the glass via the link under the site logo
## Headless or Traditional?
Lightning Commerce is headless at heart, but that doesn't mean it can't do more. Eventually, Lightning Commerce will provide three configurations depending on the desired customisability:
1. Full headless - With the planned Lightning Commerce Javascipt library, content will be easy to fetch, and will support complex queries. The checkout process will be a piece of cake to implement, with zero server-side coding needed.
2. Headless with Lightning Checkout - Based on the premise of [Snipcart](https://snipcart.com), this option will give you full flexibility when creating your customer facing site, but with Lightning Commerce on board to do the order processing heavy lifting. : Choose your content CMS, choose your css framework, build your whole site the way you want, then get out of the way and let Lightning Commerce handle the checkout process.
3. Traditional - All that sound a bit too complicated? Lightning Commerce will eventually offer a more traditional style storefront integration with a focus on encouraging customisation.

## Roadmap
There's a long way to go, but here are some of the main features planned for Lightning Commerce
### Reaching Production Ready
- Make orders fulfillable
- Make product images rearrangeable, option to add new images
- Make categories editable
- Add admin authentication
### Functionality
- Add more payment gateways (Stripe is currently the only payment gateway option)
- Add sub-categories, with unlimited depth folder structure similar to Magento
- Add collections - Create a collection containing items from multiple categories, and easily pre-populate collections using filters eg. create a "Summer 2019" collection based on a date range.
- Add variants - Add variant option to each product, create global variant templates which are suggested when editing/creating a product
### Bug fixes
- Locate and fix demo storefront checkout issues - rapidly adding and removing orders from cart can result in a payment manipulation false positive server-side, leading to order rejection.

## License
Lightning Commerce is licensed under the [MIT License](LICENSE.md)
