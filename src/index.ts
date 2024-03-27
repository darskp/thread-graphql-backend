import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser, { json } from "body-parser";
import axios from "axios";

const JSON_API = `http://localhost:5000/user`;

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;
    app.use(bodyParser.json())

    const gqlserver = new ApolloServer({
        typeDefs: `

        type User{
        id:ID!,
        Name:String!,
        email:String!
        }

        type Query{
        hello:String
        say(name:String):String
        getUser:[User]
        }

        type Mutation {
            addUser(user: inputUser!): User
            deleteUser(id: ID!): User
            updateUser(id: ID!, edit: inputUser!): User
        }

        input inputUser{
        Name:String!,
        email:String!
        }
        `,
        resolvers: {
            Query: {
                hello: () => "Hi",
                say: (parent, args: { name: String }) =>
                    `Hey! ${args.name} How are you?`,
                getUser: async () => (await axios.get(`${JSON_API}`)).data,
            },
            Mutation: {
                async addUser(parent, args) {
                    let newUserData = {
                        ...args.user,
                        id: Math.floor(Math.random() * 1000).toString()
                    }
                    let response = await axios.post(`${JSON_API}`, newUserData);
                    return response.data;
                },
                async deleteUser(parent, args) {
                    let response = await axios.delete(`${JSON_API}/${args.id}`);
                    return response.data
                },
                async updateUser(parent, args) {
                    let response = await axios.put(`${JSON_API}/${args.id}`,args.edit);
                    return response.data
                }
            }
        }
    })
    await gqlserver.start();
    app.use('/graphql', expressMiddleware(gqlserver))
    app.get('/', (req, res) => {
        res.json({ messsage: "Fetched Successfully" })
    })

    app.listen(PORT, 'localhost', () => {
        console.log(`listening at the server - http://localhost:${PORT}`);
    })
}
init();