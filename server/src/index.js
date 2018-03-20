const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info)
    },
    drafts(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: false } }, info)
    },
    post(parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id: id } }, info)
    },
    coaster(parent, args, ctx, info) {
      return ctx.db.query.coaster({}, info)
    },
    allCoasters(parent, {}, ctx, info) {
      return ctx.db.query.coasters({}, info)
    },
  },
  Mutation: {
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        { data: { title, text, isPublished: false } },
        info,
      )
    },
    createCoaster(parent, { name, struc, height, imgURL }, ctx, info) {
      return ctx.db.mutation.createCoaster(
        { data: { name, struc, height, imgURL } },
        info,
      )
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({where: { id } }, info)
    },
    deleteCoaster(parent, { id }, ctx, info) {
      return ctx.db.mutation.deleteCoaster({}, info)
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true },
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/public-trailhorse-18/prisma-rollercoasters/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
