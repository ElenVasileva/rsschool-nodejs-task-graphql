import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLList, GraphQLObjectType, GraphQLSchema, graphql } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberType, MemberTypeId } from './types/memberType.js';
import { Post } from './types/post.js';
import { Profile } from './types/profile.js';
import { User } from './types/user.js';


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
          query: new GraphQLObjectType({
            name: 'Query',
            fields: () => ({
              memberTypes: {
                type: new GraphQLList(MemberType),
                resolve: async () => { return await fastify.prisma.memberType.findMany() },
              },
              memberType: {
                type: MemberType,
                args: {
                  id: {
                    type: MemberTypeId,
                  },
                },
                resolve: async (_, { id }: { id: string }) => {
                  try {
                    return await fastify.prisma.memberType.findUnique({ where: { id } })
                  }
                  catch (error) { return new Error('error') }
                },
              },
              users: {
                type: new GraphQLList(User),
                resolve: async () => { return await fastify.prisma.user.findMany() },
              },
              user: {
                type: User,
                args: {
                  id: {
                    type: UUIDType,
                  },
                },
                resolve: async (_, { id }: { id: string }) => {
                  try {
                    const user = await fastify.prisma.user.findUnique({ where: { id } })
                    return user
                  }
                  catch (error) { return new Error('error') }
                },
              },
              profiles: {
                type: new GraphQLList(Profile),
                resolve: async () => { return await fastify.prisma.profile.findMany() },
              },
              profile: {
                type: Profile,
                args: {
                  id: {
                    type: UUIDType,
                  },
                },
                resolve: async (_, { id }: { id: string }) => {
                  try {
                    return await fastify.prisma.profile.findUnique({ where: { id } })
                  }
                  catch (error) { return new Error('error') }

                },
              },
              posts: {
                type: new GraphQLList(Post),
                resolve: async () => { return await fastify.prisma.post.findMany() },
              },
              post: {
                type: Post,
                args: {
                  id: {
                    type: UUIDType,
                  },
                },
                resolve: async (_, { id }: { id: string }) => {
                  try {
                    return await fastify.prisma.post.findUnique({ where: { id } })
                  }
                  catch (error) { return new Error('error') }
                },
              },
            }),
          })
        }),
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma: fastify.prisma },
      })

    },
  });
};

export default plugin;
