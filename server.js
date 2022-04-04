const express = require('express');
//const routes = require('./routes')
const path = require('path');
const Clases1 = require('./app.js')
const Clases2 = require('./Clases.js')
const bodyParser = require('body-parser');
const app = express();
var fs = require('fs');
const { request, response } = require('express');
app.use(bodyParser.urlencoded({ extended: true }));
const { send } = require('process');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))


// archivos estaticos
app.use(express.static('static'));

// cargar menu 
app.get('/', (request, response) => {
	//response.send('Hello express ..! :) ');
	response.sendFile(path.join(__dirname, './static/menu.html'));
});


//mustra el formulario de crear libreta de contacto
app.get('/createContactBook', (request, response) => {
	response.sendFile(path.join(__dirname, './static/createContactBook.html'));
});

//guarda la libreta de contacto en la unidad local
app.post('/SaveCB', (request, response) => {

	let name = request.body.nombre
	//console.log(name)

	if (fs.existsSync("./static/files/contactos" + name + ".json")) {
		response.sendFile(path.join(__dirname, './static/forms-css-js/CBNoGuardado.html'));
	} else {
		console.log("llego el nombre de la libreta y se guardo: ");
		Clases1.crearCB(name)
		response.sendFile(path.join(__dirname, './static/forms-css-js/CBGuardado.html'));
	}
});

//mustra el formulario de agregar contacto
app.get('/addContact', (request, response) => {
	response.sendFile(path.join(__dirname, './static/addContact.html'));
});

//guarda el contacto en la unidad local
app.post('/SaveContacts', (request, response) => {

	console.log(request.body)

	var nombre = request.body.name1;
	var apellido = request.body.apellido;
	var email = request.body.email;
	var mobil = request.body.mobil;
	var topList = request.body.topList;
	var sobreescribir = request.body.overwrite;

	var miContacto = new Clases2.Contact(nombre, apellido, email, mobil, topList);

	if (sobreescribir == 'on') {
		Clases1.sobreescribirContacto("unicaLibreta", miContacto);
		response.sendFile(path.join(__dirname, './static/mensajes/contactoAgregado.html'));
	} else {
		Clases1.guardarContacto("unicaLibreta", miContacto);
		console.log(miContacto)
		response.sendFile(path.join(__dirname, './static/mensajes/contactoAgregado.html'));
	}
});

//seleccion de CB para listar 
app.get('/selectCB', (request, response) => {
	//response.sendFile(path.join(__dirname,'./forms/addContact.html'));

	fs.readFile(path.join(__dirname, './static/selectCB.html'), (err, html) => {
		var files = fs.readdirSync('./static/files/contactos');
		var cadena = '';
		for (var i = 0; i < files.length; i++) {
			cadena = cadena + '<option' + ' name=' + files[i] + ' value=' + files[i] + '>' + files[i] + '</option>'
		}
		console.log(cadena);
		let htmlData1 = html.toString().replace("option", JSON.stringify(cadena));
		response.send(htmlData1);
	});

	//response.send(request.body);
});

//listar CB
app.post('/recibeSelectCB', (request, response) => {
	console.log(request.body.nameCB)
	var CB = request.body.nameCB
	console.log(CB)
	var array = Clases1.leerContactBook(CB)

	fs.readFile(path.join(__dirname, './static/listData.html'), (err, html) => {
		console.log(array)
		var stringC = '';
		
		for (i = 0; i < array .length; i++) {
			//console.log(array[i])
			
			var stringC = stringC + '<tr scope="table-info">' +
            '<td>' + array[i].name + '</td>' +
            '<td>' + array[i].email + '</td>' +
            '<td>' + array[i].mobil + '</td>' +
            '<td>' + array[i].topList + '</td>' +
            '</tr>';
        }
        console.log(stringC);
		let htmlPlusData = html.toString().replace('<tbody id="tabla">', '<tbody>'+stringC+'</tbody>');

        response.send(htmlPlusData);
        console.log(htmlPlusData);
	});
})

//seleccionar CB para borrar 
app.get('/selectDelate', (request, response) => {
	//response.sendFile(path.join(__dirname,'./forms/addContact.html'));

	fs.readFile(path.join(__dirname, './static/selectCBBorrar.html'), (err, html) => {
		var files = fs.readdirSync('./static/files/contactos');
		var cadena = '';
		for (var i = 0; i < files.length; i++) {
			cadena = cadena + '<option' + ' name=' + files[i] + ' value=' + files[i] + '>' + files[i] + '</option>'
		}
		console.log(cadena);
		let htmlData1 = html.toString().replace("option", JSON.stringify(cadena));
		response.send(htmlData1);
	});

	//response.send(request.body);
});

//listar para borrar
app.post('/receiveDelete', (request, response) => {
	console.log(request.body.nameCB)
	var CB = request.body.nameCB
	console.log(CB)
	var array = Clases1.leerContactBook(CB)

	fs.readFile(path.join(__dirname, './static/delateContact.html'), (err, html) => {
		console.log(array)
		var stringC = '';
		
		for (i = 0; i < array .length; i++) {
			//console.log(array[i])
			
			var stringC = stringC + '<tr scope="table-info">' +
			'<td><button type="submit" class="btn btn-primary btn-block mb-4">borrar</button></td>'+
            '<td>' + array[i].name + '</td>' +
            '<td>' + array[i].email + '</td>' +
            '<td>' + array[i].mobil + '</td>' +
            '<td>' + array[i].topList + '</td>' +
            '</tr>';
        }
        console.log(stringC);
		let htmlPlusData = html.toString().replace('<tbody id="tabla">', '<tbody>'+stringC+'</tbody>');

        response.send(htmlPlusData);
        console.log(htmlPlusData);
	});
})

app.post('/delateContact', (request, response) => {
	
})


app.post('/home', (request, response) => {
	console.log("llego un post a home")
	response.send(request.body)
})

const port = 3000;
app.listen(port, () => {
	console.log(`Express listen on port ${port}!`);
});