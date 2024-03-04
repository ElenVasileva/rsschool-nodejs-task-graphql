import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { PrismaClient } from "@prisma/client";
import { UserSubscribedTo } from "./userSubscribedTo.js";

export const SubscribedToUser = new GraphQLObjectType({
    name: 'SubscribedToUser',
    fields: () => ({
        subscriberId: { type: UUIDType },
        authorId: { type: UUIDType },
        id: {
            type: UUIDType,
            resolve: ({ subscriberId }: { subscriberId: string }) => {
                return subscriberId
            }
        },
        name: {
            type: GraphQLString,
            resolve: async ({ subscriberId }: { subscriberId: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                const author = await prisma.user.findUnique({ where: { id: subscriberId } })
                return author?.name
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserSubscribedTo),
            resolve: async ({ subscriberId }: { subscriberId: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.subscribersOnAuthors.findMany({ where: { subscriberId: subscriberId } })
                }
                catch (error) {
                    return new Error('error')
                }
            }
        }
    })
})
