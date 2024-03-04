import { PrismaClient } from "@prisma/client"
import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql"
import { SubscribedToUser } from "./subscribedToUser.js"
import { UUIDType } from "./uuid.js"

export const UserSubscribedTo = new GraphQLObjectType({
    name: 'UserSubscribedTo',
    fields: () => ({
        subscriberId: { type: UUIDType },
        authorId: { type: UUIDType },
        id: {
            type: UUIDType,
            resolve: ({ authorId }: { authorId: string }) => {
                return authorId
            }
        },
        name: {
            type: GraphQLString,
            resolve: async ({ authorId }: { authorId: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                const author = await prisma.user.findUnique({ where: { id: authorId } })
                return author?.name
            }
        },
        subscribedToUser: {
            type: new GraphQLList(SubscribedToUser),
            resolve: async ({ authorId }: { authorId: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.subscribersOnAuthors.findMany({ where: { authorId: authorId } })
                }
                catch (error) {
                    return new Error('error')
                }
            }
        }
    })
})