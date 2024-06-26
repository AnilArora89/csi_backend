import mongoose, { ConnectOptions } from "mongoose";
import { config } from "./config";
const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to database successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.log("Error in connecting to database.", err);
        });

        try {
            await mongoose.connect(config.databaseUrl as string, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            } as ConnectOptions);
        } catch (err) {
            console.log("Error connecting to database");
        }
    } catch (err) {
        console.error("Failed to connect to database.", err);
        process.exit(1);
    }
};

export default connectDB;
//we have written config.databaseUrl as a string bcoz
//sometimes people forget to write databaseUrl
//so here we avoid its validation we have written as string bss



//as we have written mongoose.connection it should be written on top of mongoose.connect(config.url) as we need to register listeners(mongoos.conection on connection on error) on top before connecting