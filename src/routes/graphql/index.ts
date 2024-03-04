import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { mutationSchema } from './mutationSchema.js';
import { querySchema } from './querySchema.js';


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {

      return await graphql({
        schema: new GraphQLSchema({
          query: querySchema,
          mutation: mutationSchema
        }),
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma: fastify.prisma },
      })

    },
  });
};

export default plugin;
