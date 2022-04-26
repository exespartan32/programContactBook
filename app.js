const Clases = require('./Clases.js');
const dirTree = require("directory-tree");
var fs = require('fs');
const { response } = require('express');
const { send } = require('process');
const { consumers } = require('stream');

// ------------------------------------------------------------------------------------------------
//muestra las libretas de contacto existentes 
const tree = dirTree('./static/files/contactos');
const array = tree.children
//console.log(tree.children[0].name);
for (i = 0; i < array.length; i++) {
    //console.log(array[i].name);
}

// ------------------------------------------------------------------------------------------------
//crea libreta de contacto
function crearCB(nombre) {
    fs.createWriteStream("./static/files/contactos/" + nombre + ".json")
}

// ------------------------------------------------------------------------------------------------
//crear contacto
function CrearContacto(nombre, nuevoContact) {
    var miContactBook = new Clases.ContactBook("unica libreta", [])
    miContactBook.addContact(nuevoContact)

    console.log(miContactBook)
    var data = JSON.stringify(miContactBook)

    console.log(data)

    fs.writeFile("./static/files/contactos/" + nombre + ".json", data, (error) => {
        if (error) {
            console.log("no se pudo escribir en el archivo")
        } else {
            console.log("escritura exitosa")
        }
    })
}

//sobreescribe el contacto
function sobreescribirContacto(nombre, nuevoContact) {
    var miContactBook = new Clases.ContactBook("unica libreta", [])
    miContactBook.addContact(nuevoContact)

    console.log(miContactBook)
    var data = JSON.stringify(miContactBook)

    console.log(data)

    fs.writeFile("./static/files/contactos/" + nombre + ".json", data, (error) => {
        if (error) {
            console.log("no se pudo escribir en el archivo")
        } else {
            console.log("escritura exitosa")
        }
    })
}

// ------------------------------------------------------------------------------------------------
//guarda el nuevo contacto 
function guardarContacto(nombre, nuevoC) {
    //abre la libreta
    fs.readFile('./static/files/contactos/' + nombre + ".json", (error, datos) => {
        if (error) {
            console.log("archivo no leido")
        } else {
            console.log("----perseando a json")

            var json_datos = JSON.parse(datos)
            //console.log(json_datos)
            console.log("contactBook")

            dataArray = json_datos.contactos
            console.log(dataArray)

            var miContactBook = new Clases.ContactBook("unica libreta", [])

            for (i = 0; i < dataArray.length; i++) {
                var nombre = json_datos.contactos[i].nombre
                var apellido = json_datos.contactos[i].apellido
                var mobil = json_datos.contactos[i].mobil
                var email = json_datos.contactos[i].email
                var topList = json_datos.contactos[i].topList

                var miContacto = new Clases.Contact(nombre,apellido, mobil, email, topList);
                miContactBook.addContact(miContacto);
            }
            miContactBook.addContact(nuevoC);
            console.log(miContactBook)

            var data = JSON.stringify(miContactBook)
            console.log(data)

            //guarda el nuevo contacto
            fs.writeFile("./static/files/contactos/" + nombre + ".json", data + "\n", (error) => {
                if (error) {
                    console.log("no se pudo escribir en el archivo")
                } else {
                    console.log("escritura exitosa")
                }
            })
        }
    });
}

// ------------------------------------------------------------------------------------------------
//lee los contactos existentes en la libreta de contacto
function leerContactBook(nombre) {
    var str = "los datos guardados son: ";
    var datos = fs.readFileSync('./static/files/contactos/' + nombre)

    var json_datos = JSON.parse(datos)
    dataArray = json_datos.contactos
   // console.log(dataArray)

    return dataArray
}

module.exports = { crearCB, sobreescribirContacto, guardarContacto, leerContactBook }