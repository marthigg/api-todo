require("dotenv").config();
const express = require("express");
const {getTareas,crearTarea,borrarTarea} = require("./db");
const {json} = require("body-parser");


const server = express();

server.use(json());

server.use("/pruebas",express.static("./pruebas_api"));


server.get("/api-todo/crear", async (peticion,respuesta) => {
    try{
        let tareas = await getTareas();

        respuesta.json(tareas);
    }catch(error){
        respuesta.status(500);
        return respuesta.json(error);
    }
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
    respuesta.send("metodo PUT");
});

server.delete("/api-todo/borrar/:id", async (peticion,respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.params.id);

        respuesta.json({resultado : cantidad > 0 ? "ok"  : "ko"});

    }catch(error){
        
        respuesta.status(500);

        respuesta.json(error);
    }
});

server.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "not found" });
});

server.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "petición no válida" });
});





server.listen(process.env.PORT);