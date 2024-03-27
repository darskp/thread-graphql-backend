"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const JSON_API = `http://localhost:5000/user`;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const PORT = Number(process.env.PORT) || 8000;
        app.use(body_parser_1.default.json());
        const gqlserver = new server_1.ApolloServer({
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
                    say: (parent, args) => `Hey! ${args.name} How are you?`,
                    getUser: () => __awaiter(this, void 0, void 0, function* () { return (yield axios_1.default.get(`${JSON_API}`)).data; }),
                },
                Mutation: {
                    addUser(parent, args) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let newUserData = Object.assign(Object.assign({}, args.user), { id: Math.floor(Math.random() * 1000).toString() });
                            let response = yield axios_1.default.post(`${JSON_API}`, newUserData);
                            return response.data;
                        });
                    },
                    deleteUser(parent, args) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let response = yield axios_1.default.delete(`${JSON_API}/${args.id}`);
                            return response.data;
                        });
                    },
                    updateUser(parent, args) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let response = yield axios_1.default.(`${JSON_API}/${args.id}`, args.edit);
                            return response.data;
                        });
                    }
                }
            }
        });
        yield gqlserver.start();
        app.use('/graphql', (0, express4_1.expressMiddleware)(gqlserver));
        app.get('/', (req, res) => {
            res.json({ messsage: "Fetched Successfully" });
        });
        app.listen(PORT, 'localhost', () => {
            console.log(`listening at the server - http://localhost:${PORT}`);
        });
    });
}
init();
