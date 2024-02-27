require("dotenv").config();
const express = require("express");
const {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTexto} = require("./db");
const {json} = require("body-parser");
const cors = require("cors");


const server = express();

server.use(cors());

server.use(json());

server.use(express.static("./estaticos"));


server.get("/api-todo", async (peticion,respuesta) => {
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

server.put("/api-todo/actualizar/:id([0-9]+)/:operacion(1|2)", async (peticion,respuesta,siguiente) => {
    
    let operacion = Number(peticion.params.operacion);

    let operaciones = [actualizarTexto,actualizarEstado];

    let {tarea} = peticion.body;

    //si la operacion es la 1, comprueba si no esta tarea o si la tarea esta vacia.
    if(operacion == 1 && (!tarea || tarea.trim() == "" )){
        return siguiente({ error : "falta el argumento tarea en el objeto JSON" });
    }

    try{ 
        let cantidad = await operaciones[operacion - 1](peticion.params.id, operacion == 1 ? tarea : null);

        respuesta.json({resultado : cantidad > 0 ? "ok"  : "ko"});

    }catch(error){
        respuesta.status(500);
        return respuesta.json(error);
    }


});

server.delete("/api-todo/borrar/:id([0-9]+)", async (peticion,respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.params.id);

        return respuesta.json({resultado : cantidad > 0 ? "ok"  : "ko"});

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