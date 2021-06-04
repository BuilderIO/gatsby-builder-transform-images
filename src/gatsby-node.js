import { createRemoteFileNode } from "gatsby-source-filesystem";
import traverse from 'traverse';
import isURL from 'validator/lib/isURL';

const defaultOptions = {
  models: ['Page'],
  shouldDownload: (field, _parent) => {
    return typeof field === 'string' && field.startsWith('https://cdn.builder.io/api/v1/image') && isURL(field);
  }
}

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
  const config = {
    ...defaultOptions,
    ...options,
  };
  const resolvers = config.models.reduce(
    (acc, model) => ({
      ...acc,
      [`builder_${model}`]: {
        localFiles: {
          type: '[File]',
          resolve: source => {
            const promises = []
            traverse(source.content.data).forEach(function (field) {
              if (config.shouldDownload(field, this.parent)) {
                const object = this;
                promises.push(
                  createRemoteFileNode({
                    url: decodeURI(field),
                    store,
                    cache,
                    createNode,
                    createNodeId,
                    reporter,
                  }).then((node) => {
                    if (config.replaceLinksToStatic) {
                      const imageName = `${node.base}`
                      const path = `${pathPrefix}/static/${node.internal.contentDigest}/${encodeURI(imageName)}`
                      if (config.debug) {
                        console.log('updating field: ', field, ' to ', path)
                      }
                      object.update(path);
                    }
                    return node
                  })
                )
              }
            })
            if (config.debug) {
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
