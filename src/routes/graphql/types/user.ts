import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { Profile } from "./profile.js";
import { Post } from "./post.js";
import { PrismaClient } from "@prisma/client";

export const User = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: {
            type: Profile,
            resolve: async ({ id }: { id: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.profile.findUnique({ where: { userId: id } })
                }
                catch (error) {
                    console.log(error)
                }

            },
        },
        posts: {
            type: new GraphQLList(Post),
            resolve: async ({ id }: { id: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.post.findMany({ where: { authorId: id } })
                }
                catch (error) {
                    console.log(error)
                }
            },
        },
    }
})