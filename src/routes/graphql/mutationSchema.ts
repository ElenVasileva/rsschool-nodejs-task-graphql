import { PrismaClient } from "@prisma/client"
import { GraphQLInputObjectType, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql"
import { HttpCompatibleError } from "../../plugins/handle-http-error.js"
import { Post } from "./types/post.js"
import { Profile } from "./types/profile.js"
import { User } from "./types/user.js"
import { UUIDType } from "./types/uuid.js"


const CreateUserInput = new GraphQLInputObjectType({
    name: "CreateUserInput",
    fields: {
        name: {
            type: GraphQLString,
        },
        balance: {
            type: GraphQLFloat
        }
    }
})

const ChangeUserInput = new GraphQLInputObjectType({
    name: "ChangeUserInput",
    fields: {
        name: {
            type: GraphQLString,
        },
        balance: {
            type: GraphQLFloat
        }
    }
})

const CreateProfileInput = new GraphQLInputObjectType({
    name: "CreateProfileInput",
    fields: {
        isMale: {
            type: GraphQLBoolean,
        },
        yearOfBirth: {
            type: GraphQLInt
        },
        userId: {
            type: GraphQLString
        },
        memberTypeId: {
            type: GraphQLString
        },
    }
})

const ChangeProfileInput = new GraphQLInputObjectType({
    name: "ChangeProfileInput",
    fields: {
        isMale: {
            type: GraphQLBoolean,
        },
        yearOfBirth: {
            type: GraphQLInt
        },
        userId: {
            type: GraphQLString
        },
        memberTypeId: {
            type: GraphQLString
        },
    }
})

const CreatePostInput = new GraphQLInputObjectType({
    name: "CreatePostInput",
    fields: {
        title: {
            type: GraphQLString
        },
        content: {
            type: GraphQLString
        },
        authorId: {
            type: GraphQLString
        },
    }
})

const ChangePostInput = new GraphQLInputObjectType({
    name: "ChangePostInput",
    fields: {
        title: {
            type: GraphQLString
        },
        content: {
            type: GraphQLString
        },
        authorId: {
            type: GraphQLString
        },
    }
})

export const mutationSchema = new GraphQLObjectType({
    name: "Mutation",
    fields: {

        createUser: {
            type: User,
            args: {
                dto: { type: CreateUserInput }
            },
            resolve: async (_, { dto }: { dto: { name: string, balance: number } }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.user.create({ data: dto })
                } catch (err) {
                    throw new Error('error');
                }
            },
        },

        changeUser: {
            type: User,
            args: {
                id: { type: UUIDType },
                dto: { type: ChangeUserInput }
            },
            resolve: async (_, { id, dto }: { id: string, dto: { name: string, balance: number } }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.user.update({
                        where: { id },
                        data: dto,
                    })
                } catch (err) {
                    throw new Error('error');
                }
            },
        },

        deleteUser: {
            type: GraphQLBoolean,
            args: {
                id: { type: UUIDType },
            },
            resolve: async (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
                await prisma.user.delete({ where: { id } })
            },
        },

        createProfile: {
            type: Profile,
            args: {
                dto: { type: CreateProfileInput }
            },
            resolve: async (_, { dto }: { dto: { isMale: boolean, yearOfBirth: number, userId: string, memberTypeId: string } }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    const a = await prisma.profile.create({ data: dto })
                    return a
                } catch (err) {
                    throw new Error('error');
                }
            },
        },

        changeProfile: {
            type: Profile,
            args: {
                id: { type: UUIDType },
                dto: { type: ChangeProfileInput }
            },
            resolve: async (_, { id, dto }: { id: string, dto: { isMale: boolean, yearOfBirth: number, userId: string, memberTypeId: string } }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.profile.update({
                        where: { id },
                        data: dto,
                    })
                } catch (err) {
                    const error = err as HttpCompatibleError
                    if (error.httpCode === 422)
                        throw new Error(`Field "userId" is not defined by type "ChangeProfileInput"`)
                    throw new Error(error.message)
                }
            },
        },

        deleteProfile: {
            type: GraphQLBoolean,
            args: {
                id: { type: UUIDType, },
            },
            resolve: async (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
                await prisma.profile.delete({ where: { id } })
            },
        },

        createPost: {
            type: Post,
            args: {
                dto: { type: CreatePostInput }
            },
            resolve: async (_, { dto }: { dto: { title: string, content: string, authorId: string } }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.post.create({ data: dto })
                } catch (err) {
                    throw new Error('error');
                }
            },
        },

        changePost: {
            type: Post,
            args: {
                id: { type: UUIDType },
                dto: { type: ChangePostInput }
            },
            resolve: async (_, { id, dto }: { id: string, dto: { title: string, content: string, authorId: string } }, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.post.update({
                        where: { id },
                        data: dto,
                    })
                } catch (err) {
                    throw new Error('error');
                }
            },
        },

        deletePost: {
            type: GraphQLBoolean,
            args: {
                id: {
                    type: UUIDType,
                },
            },
            resolve: async (_, { id }: { id: string }, { prisma }: { prisma: PrismaClient }) => {
                await prisma.post.delete({ where: { id } })
            },
        },

        subscribeTo: {
            type: User,
            args: {
                userId: {
                    type: UUIDType,
                },
                authorId: {
                    type: UUIDType,
                },
            },
            resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, { prisma }: { prisma: PrismaClient }) => {
                await prisma.subscribersOnAuthors.create({ data: { authorId, subscriberId: userId } })
                const user = await prisma.user.findUnique({ where: { id: userId } })
                return user
            },
        },

        unsubscribeFrom: {
            type: GraphQLBoolean,
            args: {
                userId: {
                    type: UUIDType,
                },
                authorId: {
                    type: UUIDType,
                },
            },
            resolve: async (_, { userId, authorId }: { userId: string, authorId: string }, { prisma }: { prisma: PrismaClient }) => {
                await prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: {
                            subscriberId: userId,
                            authorId
                        },
                    }
                })
            },
        },
    }
})