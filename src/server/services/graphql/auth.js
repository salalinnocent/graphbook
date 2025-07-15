import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLError } from "graphql";

//You export a function that takes the GraphQL schema and the name of the directive ('auth').
export function authDirectiveTransformer(schema, directiveName) {
  //This goes through every field in every object type in your schema.
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      //checks if the current filed has @auth directive applied
      const authDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      //if id does, we get the existing resolver or fall back to the default one
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        //otherwise we wrap the orignal resolve with the new one
        fieldConfig.resolve = async function (parent, args, context, info) {
          //check if the context.user is authenticated
          if (!context.user) {
            throw new GraphQLError("You are not logged in");
          }
          return resolve(parent, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
}
