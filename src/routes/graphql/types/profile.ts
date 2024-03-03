import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberTypeId } from "./memberType.js";

export const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: {
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeId },
    }
})
