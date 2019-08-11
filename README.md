# lightning-commerce
Lightning Commerce is a working prototype for a blazing fast ecommerce CMS, built on KOA for NodeJS.
## Check out the demo
Check out the demo [here](https://lightning-commerce.herokuapp.com/).
## Navigating the demo
Lightning Commerce is not currently production ready, but the demo gives you a good idea of what it's about and how it works. 

**Please note that the demo application is deployed on a Heroku free dyno for cost reasons, so will need 10 seconds or so to start up the server when launched after being idle for over 30 minutes.**

Opening the demo you will arrive on the *glass*, the customer facing website. 

You can switch from the glass to the backoffice via the link at the top right, and from the backoffice to the glass via the link under the site logo. Most of the backoffice is fully functional, while the glass is just a simple demo application (and not mobile responsive) to show how payment processing is handled with Lightning Commerce. Go to t-shirts, add a product to the cart, and complete the checkout process with the demo bank card suggested on the checkout page. The completed order will then be added to the backoffice fulfillment wizard.

## Getting started with your own project
The easiest way to get started using Lightning Commerce with your online store is to use the lightning commerce CLI. To get started, navigate to the parent directory you want to start your project in, and run **npx @cnimmo16/create-lightning-commerce"**. This will launch the CLI wizard. Customise your options, and let the CLI set everything up for you automatically!

## Directory Structure
The lightning commerce admin dashboard is built with VueJS. The folder structure places all server logic and webpack generated static assets in the /server directory, while the uncompressed files are kept in the /client directory. Running "npm run build" in the client directory will generate the production ready assets in the /server/views and /server/public directories. When deploying to a server the /client directory should not be deployed.

No store front-end is not included in this repository. You will need to set up a frontend on your own to communicate with the backend. By default, the server will look for this at /server/views/glass.

To see the demo storefront code, please see the [demo repository](https://github.com/CNimmo16/lightning-demo).

## Headless or Traditional?
Lightning Commerce is headless at heart, but that doesn't mean it can't do more. Eventually, Lightning Commerce will provide three configurations depending on the desired customisability:
1. Full headless - With the planned Lightning Commerce Javascipt library, content will be easy to fetch, and will support complex queries. The checkout process will be a piece of cake to implement, with zero server-side coding needed.
2. Headless with Lightning Checkout - Based on the premise of [Snipcart](https://snipcart.com), this option will give you full flexibility when creating your customer facing site, but with Lightning Commerce on board to do the order processing heavy lifting. : Choose your content CMS, choose your css framework, build your whole site the way you want, then get out of the way and let Lightning Commerce handle the checkout process.
3. Traditional - All that sound a bit too complicated? Lightning Commerce will eventually offer a more traditional style storefront integration with a focus on encouraging customisation.

## Roadmap
There's a long way to go, but here are some of the main features planned for Lightning Commerce
### Reaching Production Ready
- Make product images rearrangeable, option to add new images
- Make categories editable
### Functionality improvements
- Add more payment gateways (Stripe is currently the only payment gateway option)
- Add sub-categories, with unlimited depth folder structure similar to Magento
- Add collections - Create a collection containing items from multiple categories, and easily pre-populate collections using filters eg. create a "Summer 2019" collection based on a date range.
- Add variants - Add variant option to each product, create global variant templates which are suggested when editing/creating a product
### Bug fixes
- Nothing yet :) If you find a bug within Lightning Commerce, please report it in the issues section.

## License
Lightning Commerce is licensed under the [MIT License](LICENSE.md)
