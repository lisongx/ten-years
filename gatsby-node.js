
const Promise = require('bluebird')
const path = require('path')

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
