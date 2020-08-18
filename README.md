## Description

This plugin extends the Gatsby Builder.io GraphQL schema to add a `localFiles` field to any builder model types specified in options. The field `localFiles` returns a `File`  Array type. This enables downloading remote images to local so you have the flexibility to deploy them to a different CDN (or even process them with `gatsby-plugin-sharp` if you need to). This plugin is inspired by the [localFile field from Sanity](https://github.com/leanjs/gatsby-source-sanity-transform-images).


### Dependencies

This plugin depends on [@builder.io/gatsby](https://github.com/BuilderIO/builder/tree/master/packages/gatsby)

## How to install

`npm i @builder.io/gatsby @builder.io/gatsby-image-transoformer --save`

```js
// in your gatsby-config.js
module.exports = {
  // ...
  plugins: [
    // ...
    {
      resolve: "@builder.io/gatsby-image-transoformer",
      options: {
        models: ['Page', 'LandingPage'] // Class case
      }
    }
  ]
  // ...
};
```

## When do I use this plugin?

If you want to download assets for static distribution instead of using Sanity's CDN. This plugin downloads the Sanity Assets to the local filesystem.

Useful for reduced data usage in development or projects where you want the assets copied locally with builds for deploying without links to Sanity's CDN.

## Examples of usage

```GraphQL
  query($path: String!) {
    allBuilderModels {
      page(
        target: { urlPath: $path }
        limit: 1
        options: { cachebust: true }
      ) {
        content
        # download all image assets from content and make them available on localFiles Array
        localFiles {
          publicURL
          childImageSharp {
            fluid(maxWidth: 910) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }
  }
```

## How to contribute

Thanks for your interest in contributing to this plugin! Pull Requests welcome for any level of improvement, from a small typo to a new section, help us make the project better.

### How to run the tests

`yarn test`

### Pull Requests

To submit a pull request, follow these steps

1. Fork and clone this repo
2. Create a branch for your changes
3. Install dependencies with `yarn`
4. Make changes locally
5. Make sure tests pass, otherwise update the tests
6. Commit your changes
7. Push your branch to origin
8. Open a pull request in this repository with a clear title and description and link to any relevant issues
9. Wait for a maintainer to review your PR
