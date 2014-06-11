var socket = io.connect('http://'+window.location.host+':3000');
socket.emit('loginuser',$('#usuario').text(), 
          $('#area').text()+'_'+$('#area').attr('data-ida'), 
          $('#usuario').attr('user_id'));
socket.on("Conectado", conectado);
function conectado(mensaje){
    console.log(mensaje);
}

$('body').timeago();

function checkbox (){
	$('input').each(function(){
    var self = $(this),
      label = self.next(),
      label_text = label.text();

    label.remove();
    self.iCheck({
      checkboxClass: 'icheckbox_line-green',
      radioClass: 'iradio_line-green',
      insert: '<div class="icheck_line-icon"></div>' + label_text
    });
  });
}

function verificartiempomozos() {
    var contadorespera = $('#lista_controlpedidos .E').length;
    if(contadorespera > 0){
        socket.emit('TiemposMozos', $('#area').attr('data-idlocal'));
    }
}
setInterval(verificartiempomozos,6000);

socket.on("NotificacionDemoraMozos", notificaciondemoramozos);

function notificaciondemoramozos(data){
    if (data[0]['TiempoEspera'] >= 2){
        document.getElementById('sonido_demora').play();
    }else{
        document.getElementById('sonido_demora').pause();
    }
}

//control pedidos
$("#windowscontrolpedidos").kendoWindow({
  				actions: ["Pin","Minimize","Maximize", "Close"],
  				visible: false,
  				title: 'Notificaiones Pedidos',
  				resizable: false,
  				width: '500px',
  				animation: false,
  				position: { top: 50 , left: 100}
});

$("#btn_controlpedidos").on('click', function(event) {
	event.preventDefault();
	/* Act on the event */
	$('#windowscontrolpedidos').data("kendoWindow").open();
});

//fincontrolpedidos


//notificaciones
$("#windowsnotificaciones").kendoWindow({
  				actions: ["Pin","Minimize","Maximize", "Close"],
  				visible: false,
  				title: 'Notificaiones Pedidos',
  				resizable: false,
  				width: '350px',
  				height: '500px',
  				animation: false,
  				position: { top: 50 , left: 100}
});
var notificationpedido = $("#notificationpedidos").kendoNotification({
                        appendTo: "#windowsnotificaciones",
                        autoHideAfter: 0,
                        stacking: "down",
                        templates: [{
                            type: "info",
                            template: $("#notificacionpedidos").html()
                        }]
                    }).data("kendoNotification");

socket.on('NotificacionPedidos',notificacionespedidos);
socket.on('ActualizarControlpedidos',actulizarcontrolpedidos);
socket.on('ActulizarestadoAll', actulizarestadosall);
socket.on('ActulizarPedidosMesa',actulizarpedidosmesa);

//actulizarpedidosmesa
function actulizarpedidosmesa(idpedido, usuario){
	var mesaid;
	$.ajax({
		url: '/pedidomesa',
		type: 'POST',
		dataType: 'json',
		data: {idpedido: idpedido},
	})
	.done(function(data) {
		mesaid= data['mesa_id'];
		if($('#infomesa').attr('data-id') == mesaid){
			if($('#usuario').attr('user_id')!= usuario){
				location.reload();
			}
		}else{
			$('.btn_mesascajas').filter(function(index) {
				return $(this).attr('data-id') == mesaid;
			}).addClass('O');
			$('.btn_mesascajas').filter(function(index) {
				return $(this).attr('data-id') == mesaid;
			}).attr('data-estado', 'O');
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}
//finactulizarpedidosmesa

//actulizarestados todos
	function actulizarestadosall(data){
		var estado = data['estado'];
		var preestado = '';
		if(data['estado'] == 'P'){
			prestado = 'I';
		}else if (data['estado'] == 'E'){
			prestado = 'P';
		}else if (data['estado'] == 'D') {
			prestado = 'E';
		};	
		var oitempedido = $('.'+prestado).filter(function(index) {
			return $(this).attr('data-iddetped') == data['iddetallep'];
		});
		oitempedido.removeClass(prestado);
		oitempedido.addClass(data['estado']);
		oitempedido.attr('data-estado', data['estado']);
		if(estado == 'C'){
			estado = 'I';
		}
		oitempedido.find('img').attr('src', '/images/'+estado+'.png');
	}
//finactulizarestados todos

var template_controlpedidos = kendo.template($('#refresh_listcontrolpedidos').html());

function actulizarcontrolpedidos(){
	$.ajax({
		url: '/controlpedidos',
		type: 'GET',
		dataType: 'json'
	})
	.done(function(data) {
		$('#lista_controlpedidos').html(template_controlpedidos({listaplatos: data}));
		$('.timeago').timeago('refresh');
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

function notificacionespedidos(data){
	if(data['estado'] == 'E'){
		notificationpedido.show({
                            mesa: data['mesa'],
                            mozo: data['usuario'],
                            producto: data['producto'] 
                        }, "info");
		$('#windowsnotificaciones').data("kendoWindow").open();
		document.getElementById('sonido_recibirpedido').play();
	}
}
$('#btn_notificaciones').on('click', function(event) {
	event.preventDefault();
	/* Act on the event */
	$('#windowsnotificaciones').data("kendoWindow").open();
});
//finnotificaciones

//cerrarcaja
$('input[name=arqueo]').on('change', function(event) {
	event.preventDefault();
	var newarqueo = parseFloat($(this).val());
	var newdiferencia = parseFloat($('input[name=importetotal]').val()) - newarqueo;
	$('input[name=arqueo]').val(newarqueo.toFixed(2))
	$('input[name=diferencia]').val(newdiferencia.toFixed(2));
});
//fincerrarcaja

$('#btn_salirmesa').on('click', function(event) {
	event.preventDefault();
	/* Act on the event */
	window.location.href = '/cajas';
});
    $("#tabstrip").kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }
    });

	$('.btn_mesascajas').on('click', function(event) {
		event.preventDefault();
		var idmesa = $(this).attr('data-id');
		if($(this).attr('data-estado') == 'O'){
			window.location.href = '/cajas/cargarmesa/' + idmesa;
		}else{
			$.ajax({
				url: '/traermozos',
				type: 'POST',
				dataType: 'json',
				data: {idres: 2},
			})
			.done(function(data) {
				var contenido = '';
					for(var i in data) {
						contenido += '<li class="list-group-item"><input value ="'+data[i]['id']+'" type="radio" name="line-radio"><label>';
						contenido += data[i]['login']+'</label></li>';
					};
				$('.listamozos').html(contenido);
				checkbox ();
				$('.modalwindow').data("kendoWindow").open();
				$('.modalwindow').data("kendoWindow").center();
				$('#btn_aceptar_mozo').attr('data-idmesa',idmesa);
			});
		}
	});
	$('#btn_cancelar_mozo').on('click', function(event) {
		event.preventDefault();
		$('.modalwindow').data("kendoWindow").close();
	});
	$('#btn_aceptar_mozo').on('click', function(event) {
		event.preventDefault();
		window.location.href = '/cajas/cargarmesa/' + $(this).attr('data-idmesa')+'/'+$('input[name=line-radio]:checked').val();
	});
	$(".modalwindow").kendoWindow({
  				actions: ["Close"],
  				visible: false,
  				modal: true,
  				title: 'Elegir Mozo',
  				resizable: false,
  				width: '250px',
  				animation: false
	});

//actulizar estados
$('#productosenviados').on('click', '.E', function(event) {
	event.preventDefault();
	/* Act on the event */
	var oitem = $(this);
     if($(this).attr('data-estado') == 'E'){
     	actulizarestados($(this).attr('data-estado'), $(this).attr('data-iddetped'));
     }
});

$('#lista_controlpedidos').on('click', '.E', function(event) {
	event.preventDefault();
	/* Act on the event */
	var oitem = $(this);
     if($(this).attr('data-estado') == 'E'){
     	actulizarestados($(this).attr('data-estado'), $(this).attr('data-iddetped'));
     }
});

function actulizarestados(estado, iddetalle){
    $.ajax({
        type: 'POST',
        url: '/mozonotificaciones',
        dataType: "json",
        data:{estado: estado, iddetallep: iddetalle},
        success: function(data){
        	socket.emit('NotificarPedidos', data, data['areapro']);
        	verificartiempomozos();
        }
    });
}

//fin actulizar estados