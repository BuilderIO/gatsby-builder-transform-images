import { createRemoteFileNode } from "gatsby-source-filesystem";
import traverse from 'traverse'
export const createResolvers = (
  {
    actions: { createNode },
    cache,
    createNodeId,
    createResolvers,
    store,
    reporter,
  },
  options
) => {
  const resolvers = options.models.reduce(
    (acc, model) => ({
      ...acc,
      [`builder_${model}`]: {
        localFiles: {
          type: '[File]',
          resolve: source => {
            const promises = []
            traverse(source.content.data).forEach(field => {
              if (
                typeof field === 'string' &&
                field.startsWith('https://cdn.builder.io/api/v1/image')
              ) {
                // todo: read width height fit format from field and add them to node, or strip query param and load the full file
                promises.push(
                  createRemoteFileNode({
                    url: field,
                    store,
                    cache,
                    createNode,
                    createNodeId,
                    reporter,
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
