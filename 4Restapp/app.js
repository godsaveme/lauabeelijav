var express = require('express');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var connections = 0;
var usuarios = {};
var areas = {};
var app = express();
var server = http.createServer(app);
io = io.listen(server);

var mysql =  require('mysql');
var mysqlconect =  mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password: 'root',
    database: 'db_4rest'
    });

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var bodyParser = require('body-parser');
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
var session = require('express-session')
app.use(session({secret: 'kangoclientes',cookie:{maxAge:120000}}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response) {
    response.render('error');
});

app.get('/clientes/?:codigomesa?', function(request, response) {
    var codigomesa = request.params.codigomesa;
    if (codigomesa) {
        mysqlconect.query(
            "SELECT mesa.id, restaurante.nombreComercial, mesa.nombre FROM mesa INNER JOIN salon ON salon.id = mesa.salon_id INNER JOIN restaurante ON restaurante.id = salon.restaurante_id WHERE mesa.mesa = ?",
             [codigomesa], function selectUsuario(err, results, fields) {
                if (err) {
                    console.log("Error: " + err.message);
                    throw err;
                }
            response.render('index', {nombreComercial: results[0]['nombreComercial'],
                                     mesa: results[0]['nombre'],
                                    codigomesa: codigomesa});
        });
    }else{
        response.render('error');
    }
});

app.post('/llamarmozo', function(request, response){
    codigomesa = request.body.codigomesa;
    if(request.session.llamarmozo){
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({dato: 1 }));
    }else{
        request.session.llamarmozo = codigomesa;
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({dato : 0}));
    }
});

app.post('/pedircuenta', function(request, response){
codigomesa = request.body.codigomesa;
    if(request.session.pedircuenta){
        mysqlconect.query(
            "select dettiketpedido.preciou, dettiketpedido.precio, dettiketpedido.nombre, dettiketpedido.cantidad, usuario.login, mesa.nombre as mesa FROM dettiketpedido INNER JOIN pedido on pedido.id = dettiketpedido.pedido_id inner join detmesa on detmesa.pedido_id = pedido.id inner join mesa on mesa.id = detmesa.mesa_id inner join usuario on usuario.id = pedido.usuario_id where mesa.mesa = ? and pedido.estado != ? and pedido.estado != ?",
             [codigomesa, 'T', 'A'], function selectUsuario(err, results, fields) {
                if (err) {
                    console.log("Error: " + err.message);
                    throw err;
                }
            response.setHeader('Content-Type', 'application/json');
            if(results.length > 0){
                response.send(JSON.stringify({dato : 2, productos: results}));
            }else{
                response.send(JSON.stringify({dato : 0}));
            }
        });
    }else{
        mysqlconect.query(
            "select dettiketpedido.preciou, dettiketpedido.precio, dettiketpedido.nombre, dettiketpedido.cantidad, usuario.login, mesa.nombre as mesa FROM dettiketpedido INNER JOIN pedido on pedido.id = dettiketpedido.pedido_id inner join detmesa on detmesa.pedido_id = pedido.id inner join mesa on mesa.id = detmesa.mesa_id inner join usuario on usuario.id = pedido.usuario_id where mesa.mesa = ? and pedido.estado != ? and pedido.estado != ?",
             [codigomesa, 'T', 'A'], function selectUsuario(err, results, fields) {
                if (err) {
                    console.log("Error: " + err.message);
                    throw err;
                }
            if(results.length > 0){a = request.body.codigomesa
                request.session.pedircuenta = codigomesa;
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({dato : 1, productos: results}));
            }else{
                response.send(JSON.stringify({dato : 0}));
            }
        });
    }
});

app.post('/llamarsupervisor', function(request, response){
    codigomesa = request.body.codigomesa;
    if(request.session.llamarsupervisor){
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({dato: 1 }));
    }else{
        request.session.llamarsupervisor = codigomesa;
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({dato : 0}));
    }
});

io.sockets.on('connection', socketconection);

function socketconection(cliente){
	cliente.on('loginuser',function(usuario, area, id){
        if(!areas[area]){
            areas[area] = area;
        }
        if(!usuarios[usuario]){
            usuarios[usuario] = {nombre: usuario, area: area, id: id};
        }
    cliente.usuario = usuario;
    cliente.area = area;
    cliente.join(area);
    cliente.join(usuario);
    });

    cliente.on('NotificarPedidos', function(data, area){
            io.sockets.in(area).emit("NotificacionPedidos", data);
            io.sockets.emit('ActulizarestadoAll', data);
            io.sockets.emit('ActualizarControlpedidos');
    });

    cliente.on('Enviaracocina', function(mesa, pedido, cocinas, usuario){
            io.sockets.emit('Recibirpedidos',cocinas, mesa, pedido);
            io.sockets.emit('ActulizarPedidosMesa', pedido,usuario);
            io.sockets.emit('ActualizarControlpedidos');
    });

    cliente.on('CerrarMesa', function(idmesa, area){
        io.sockets.in(area).emit('CerrarMesa',idmesa);
    });

    cliente.on('AbrirMesa', function(idmesa, area){
        io.sockets.in(area).emit('AbrirMesa',idmesa);
    });

    cliente.on('TiemposCocina', function(idarea, usuario){
        mysqlconect.query(
            "SELECT max(TIMESTAMPDIFF(MINUTE , FechaInicio, NOW())) AS TiempoEspera FROM detallepedido WHERE cast(FechaInicio AS DATE) BETWEEN cast(NOW() AS DATE) AND cast(NOW() AS DATE) AND estado = ? AND idarea = ?",
             ['I',idarea], function selectUsuario(err, results, fields) {
                if (err) {
                    console.log("Error: " + err.message);
                    throw err;
                }
            io.sockets.in(usuario).emit("NotificacionDemora", results);
                console.log(results);
        });
    });

    cliente.on('TiemposMozos', function(idrestaurante){
        mysqlconect.query(
            "SELECT max(TIMESTAMPDIFF(MINUTE , fechaDespacho, NOW())) AS TiempoEspera FROM detallepedido INNER JOIN pedido ON pedido.id = detallepedido.pedido_id INNER JOIN usuario ON usuario.id = pedido.usuario_id WHERE usuario.id_restaurante = ? AND cast(detallepedido.FechaInicio AS DATE) BETWEEN  cast(now() AS DATE) AND cast(now() AS DATE) AND detallepedido.estado = ?",
             [idrestaurante,'E'], function selectUsuario(err, results, fields) {
                if (err) {
                    console.log("Error: " + err.message);
                    throw err;
                }
            io.sockets.emit("NotificacionDemoraMozos", results);
                console.log(results);
        });
    });

    cliente.on('LlamarMozo', function(mesa, codigomesa) {
        mysqlconect.query(
        "SELECT usuario.login FROM usuario INNER JOIN pedido ON pedido.usuario_id  = usuario.id INNER JOIN detmesa ON detmesa.pedido_id = pedido.id INNER JOIN mesa ON mesa.id = detmesa.mesa_id WHERE mesa.mesa = ? AND pedido.estado != ? AND pedido.estado != ?",
         [codigomesa, 'T', 'A'], function selectUsuario(err, results, fields) {
            if (err) {
                console.log("Error: " + err.message);
                throw err;
            }
            if(results.length > 0){
                io.sockets.emit('NotificacionMesa', mesa, results,1);
                
            }else{
                io.sockets.emit('NotificacionMesa', mesa,results,0);
            }
        });
    });

    cliente.on('PedirCuenta', function(mesa, mozo) {
        io.sockets.emit('PrecuentaMesa', mesa, mozo);
    });

    cliente.on('LlamarSupervisor', function(mesa, codigomesa){
        mysqlconect.query(
        "SELECT usuario.login FROM usuario INNER JOIN pedido ON pedido.usuario_id  = usuario.id INNER JOIN detmesa ON detmesa.pedido_id = pedido.id INNER JOIN mesa ON mesa.id = detmesa.mesa_id WHERE mesa.mesa = ? AND pedido.estado != ? AND pedido.estado != ?",
         [codigomesa, 'T', 'A'], function selectUsuario(err, results, fields) {
            if (err) {
                console.log("Error: " + err.message);
                throw err;
            }
            if(results.length > 0){
                io.sockets.emit('SupervisorMesa', mesa, results,1);
                
            }else{
                io.sockets.emit('SupervisorMesa', mesa,results,0);
            }
        });
    });
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});