import { PrismaClient } from "@prisma/client"
import { GraphQLObjectType, GraphQLList } from "graphql"
import { MemberType, MemberTypeId } from "./types/memberType.js"
import { Post } from "./types/post.js"
import { Profile } from "./types/profile.js"
import { User } from "./types/user.js"
import { UUIDType } from "./types/uuid.js"


export const querySchema = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async (_, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                return await prisma.memberType.findMany()
            },
        },
        memberType: {
            type: MemberType,
            args: {
                id: {
                    type: MemberTypeId,
                },
            },
            resolve: async (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.memberType.findUnique({ where: { id } })
                }
                catch (error) { return new Error('error') }
            },
        },
        users: {
            type: new GraphQLList(User),
            resolve: async (_, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                return await prisma.user.findMany()
            },
        },
        user: {
            type: User,
            args: {
                id: {
                    type: UUIDType,
                },
            },
            resolve: async (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    const user = await prisma.user.findUnique({ where: { id } })
                    return user
                }
                catch (error) { return new Error('error') }
            },
        },
        profiles: {
            type: new GraphQLList(Profile),
            resolve: async (_, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                return await prisma.profile.findMany()
            },
        },
        profile: {
            type: Profile,
            args: {
                id: {
                    type: UUIDType,
                },
            },
            resolve: async (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.profile.findUnique({ where: { id } })
                }
                catch (error) { return new Error('error') }

            },
        },
        posts: {
            type: new GraphQLList(Post),
            resolve: async (_, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                return await prisma.post.findMany()
            },
        },
        post: {
            type: Post,
            args: {
                id: {
                    type: UUIDType,
                },
            },
            resolve: async (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.post.findUnique({ where: { id } })
                }
                catch (error) { return new Error('error') }
            },
        },
    }),
})