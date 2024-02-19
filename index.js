require("dotenv").config();
const express = require("express");


const server = express();

server.use("/pruebas",express.static("./pruebas_api"));

server.get("/api-todo/crear", (peticion,respuesta) => {

});

server.post("/api-todo/crear", async  (peticion,respuesta,siguiente) => {

    let {tarea} = peticion.body;

    if(tarea && tarea.trim() != ""){
        try{
            let id = await crearTarea({tarea});
            respuesta.json({id});
        }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
        }
    }
    
    siguiente({ error : "falta el argumento tarea en el objeto JSON" });

});

server.put("/api-todo/crear", (peticion,respuesta) => {

});

server.delete("/api-todo/crear", (peticion,respuesta) => {

});

server.use((peticion,respuesta) => {
    respuesta.json({ error : "not found" });
});





server.listen(process.env.PORT);