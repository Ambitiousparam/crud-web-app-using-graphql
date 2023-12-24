const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema, 
} = require("graphql");

const app = express();
let usersList = [
    { id: "1", name: "Nikhil", email: "nikhil@test.com" },
    { id: "2", name: "john cena", email: "john@test.com" },
    { id: "3", name: "Michael", email: "Michael@test.com" },
];

// Fix the typo here (GraphQlObjectType to GraphQLObjectType)
const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        // to get all users
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return usersList;
            },
        },
        //to get only one user at a time
        user:{
            type:UserType,
            args:{id: {type:GraphQLID}},
            resolve(parent,args){
             return usersList.find((user=>user.id==args.id))
            }
        }
    },
});
const mutations = new GraphQLObjectType({
    name:"mutations",
    fields:{
        
        addUser:{
            type:UserType,
            args:{name:{type:GraphQLString},email:{type:GraphQLString}},
            resolve(parent,{name,email}){
            const newUser = {name,email,id:Date.now().toString()}
            usersList.push(newUser);
            return newUser;
        },
        },
        updateUser:{
            type:UserType,
            args:{
                id:{type:GraphQLID},
                name:{type:GraphQLString},
                email:{type:GraphQLString}
           },
           resolve(parent,{id,name,email}){
            const user = usersList.find((u)=>u.id==id);
            user.name = name;
            user.email= email;
            return user;

           }
        },
        deleteUser:{
            type:UserType,
            args:{
                id:{type:GraphQLID},
                
            },
            resolve(parent,{id}){
               const user = usersList.find((u)=>u.id === id)
               usersList = usersList.filter((u)=>u.id!==id);
               return user;
            }
        }

    },
})
const schema = new GraphQLSchema({ query: RootQuery,mutation:mutations});

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.listen(5000, () => console.log("server is running at port 5000"));
