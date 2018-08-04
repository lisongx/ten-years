
const Promise = require('bluebird')
const path = require('path')

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /react-image-lightbox/,
              use: loaders.null(),
            },
          ],
        },
      })
    }
  }

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions
    return new Promise((resolve, reject) => {
        const placeTemplate = path.resolve(`src/templates/place.js`)
        resolve(
        graphql(`
            {
                allPlacesYaml(sort: {fields:[id]}) {
                    edges{
                        node{
                            name
                            slug
                            longitude
                            latitude
                        }
                    }
                }
            }
        `).then(result => {
            if (result.errors) {
                reject(result.errors)
            }

            const places = result.data.allPlacesYaml.edges;

            places.forEach((edge, index) => {
                const isLast = index === places.length - 1
                const isFirst = index === 0
                const previous = isFirst ? null : places[index - 1].node;
                const next = isLast ? null : places[index + 1].node;

                createPage({
                    path: `${edge.node.slug}`,
                    component: placeTemplate,
                    context: {
                        slug: edge.node.slug,
                        previous,
                        next,
                    },
                })
            })
            return
        })
        )
    })
}

// copy from
// https://github.com/gatsbyjs/gatsby/issues/4899#issuecomment-384389758

const fastExif = require('fast-exif');
const get = require('lodash/get');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  console.log(node)

if(node.internal.mediaType === 'image/jpeg') {
      const absolutePath = node.absolutePath;
      fastExif.read(absolutePath)
        .then((exifData) => {

          const title        = get( exifData, [ 'image', 'ImageDescription' ], null );
          const location     = get( exifData, [ 'image', 'DocumentName' ], null );
          const categoryData = get( exifData, [ 'exif', 'ImageHistory' ], null );
          const categories   = categoryData === null ? [ 'uncategorized' ] : categoryData.split( ',' );
          const iso          = get( exifData, [ 'exif', 'ISO' ], null );
          const model        = get( exifData, [ 'exif', 'LensModel' ], null );
          const fstop        = get( exifData, [ 'exif', 'FNumber' ], null );
          const focalLength  = get( exifData, [ 'exif', 'FocalLength' ], null );
          const time = get(exifData, ['exif', 'DateTimeOriginal'], null) ||
            get(exifData, ['time', 'ModifyDate'], null)

            createNodeField({
            node,
            name: 'exif',
            value: {
                title, location, categories, time,
                technical: {iso, model, fstop, focalLength}}
            });
        })
        .catch((err) => console.error(err));
  }
}
