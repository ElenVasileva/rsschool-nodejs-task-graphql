import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberType, MemberTypeId } from "./memberType.js";
import { PrismaClient } from "@prisma/client";

export const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: {
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeId },
        memberType: {
            type: MemberType,
            resolve: async ({ memberTypeId }: { memberTypeId: string }, _args: unknown, { prisma }: { prisma: PrismaClient }) => {
                try {
                    return await prisma.memberType.findUnique({ where: { id: memberTypeId } })
                }
                catch (error) {
                    return new Error('error')
                }
            },
        },
    }
})
