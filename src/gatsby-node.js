import { createRemoteFileNode } from "gatsby-source-filesystem";
import traverse from 'traverse';

const defaultModels = ['Page'];

export const createResolvers = (
  {
    actions: { createNode },
    cache,
    createNodeId,
    createResolvers,
    pathPrefix,
    store,
    reporter,
  },
  options
) => {
  const resolvers = (options.models || defaultModels).reduce(
    (acc, model) => ({
      ...acc,
      [`builder_${model}`]: {
        localFiles: {
          type: '[File]',
          resolve: source => {
            const promises = []
            traverse(source.content.data).forEach(function (field) {
              if (
                typeof field === 'string' &&
                field.startsWith('https://cdn.builder.io/api/v1/image')
              ) {

                promises.push(
                  createRemoteFileNode({
                    url: field,
                    store,
                    cache,
                    createNode,
                    createNodeId,
                    reporter,
                  }).then((node) => {
                    if (options.replaceLinksToStatic) {
                      const imageName = `${node.name}-${node.internal.contentDigest}${node.ext}`
                      object.update(`${pathPrefix}/static/${imageName}`)
                    }
                    return node
                  })
                )
              }
            })
            if (options.debug) {
              console.log(`downloaded ${promises.length} images from content ${source.content.id} on model ${model}` )
            }
            return Promise.all(promises)
          },
        },
      },
    }),
    {}
  )
  createResolvers(resolvers)
};
