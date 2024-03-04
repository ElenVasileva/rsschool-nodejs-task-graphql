import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { Profile } from "./profile.js";
import { Post } from "./post.js";
import { PrismaClient } from "@prisma/client";
import { UserSubscribedTo } from "./userSubscribedTo.js";
import { SubscribedToUser } from "./subscribedToUser.js";

export const User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
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
                    return new Error('error')
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
                    return new Error('error')
                }
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(UserSubscribedTo),
            resolve: async ({ id }: { id: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.subscribersOnAuthors.findMany({ where: { subscriberId: id } })
                }
                catch (error) {
                    return new Error('error')
                }
            },
        },
        subscribedToUser: {
            type: new GraphQLList(SubscribedToUser),
            resolve: async ({ id }: { id: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.subscribersOnAuthors.findMany({ where: { authorId: id } })
                }
                catch (error) {
                    return new Error('error')
                }
            },
        }
    })
})