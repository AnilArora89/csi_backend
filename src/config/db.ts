import mongoose from "mongoose";
import {config} from './config'
const connectDB = async () =>{
    try{
        
        mongoose.connection.on('connected', ()=>{
            console.log("Conencted To DB")
        })

        mongoose.connection.on('error', ()=>{
            console.log("Error in connection of db");
        })

        await mongoose.connect(config.databaseUrl as string);


    }    
    catch(err){
        console.log("Failed to connect to database",err);
        process.exit(1);
    }
};


export default connectDB;
//we have written config.databaseUrl as a string bcoz
//sometimes people forget to write databaseUrl
//so here we avoid its validation we have written as string bss



//as we have written mongoose.connection it should be written on top of mongoose.connect(config.url) as we need to register listeners(mongoos.conection on connection on error) on top before connecting