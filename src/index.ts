import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;
    app.use(express.json())

    const gqlserver = new ApolloServer({
        typeDefs: `
        type Query{
        hello:String
        }
        `,
        resolvers: {
            Query:{
                hello:()=>"Hi"
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