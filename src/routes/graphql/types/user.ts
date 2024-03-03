import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { Profile } from "./profile.js";
import { Post } from "./post.js";

export const User = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: { type: Profile },
        posts: { type: new GraphQLList(Post) },
    }
})