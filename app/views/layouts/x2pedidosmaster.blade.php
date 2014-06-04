<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>
		@section('titulo')
		Gestión de Pedidos
		@show
	</title>
	@section('cssgeneral')
	{{HTML::style('css/normalize.css')}}
	{{HTML::style('css/foundation.css')}}
  {{HTML::style('css/foundation-icons.css')}}
  {{HTML::style('css/jquery.timeentry.css')}}
	{{HTML::style('css/general.css')}}
  {{HTML::style('css/smoothness/jquery-ui-1.10.4.custom.min.css')}}
  {{HTML::style('css/estilos.css')}}
  {{HTML::style('css/alertify.core.css')}}
  {{HTML::style('css/alertify.default.css')}}
  <!--stilos tooltipster-->
  {{HTML::style('css/tooltipster.css')}}  
  {{HTML::style('css/themes/tooltipster-punk.css')}}
  {{HTML::style('css/themes/tooltipster-shadow.css')}}
  {{HTML::style('css/themes/tooltipster-noir.css')}}
  {{HTML::style('css/themes/tooltipster-light.css')}}
	@show
  @yield('css')
</head>
<body>
<!--<div class="row"><div class="large-12 columns">-->
<div class="off-canvas-wrap">
  <div class="inner-wrap">
    <nav class="tab-bar">
      <section class="left-small">
        <a class="left-off-canvas-toggle menu-icon" ><span></span></a>
      </section>

      <section class="middle tab-bar-section">
      <?php $segmento = Request::segment(2);?>
      @if ($segmento == 'cargarpedido' || $segmento == 'abrirpedido')
      {{Form::button('Facturar Pedido', array('id' => 'btnCnclrPd' , 'class' => 'button  tiny alert left' , 'data-ped' => $Opedido->id,'style'=>'margin-top: 5px;') )}}
      {{Form::button('Enviar órdenes', array('id' => 'btnEnviarOrdenes' , 'class' => 'button  tiny left', 'style'=>'margin-left: 10px; margin-top: 5px;') )}}
      @endif
        &nbsp;
        &nbsp;
        &nbsp;
        @section('nombremesa')
        
        @show
        &nbsp;
        &nbsp;
        &nbsp;
        @if(Auth::check())
        <a href="javascript:void(0)" user_id ="{{Auth::user()->id}}" id ="usuario">{{Auth::user()->login}}</a>
            <?php $nombrearea= Areadeproduccion::find(Auth::user()->id_tipoareapro); ?>
          <a href="javascript:void(0)" id="area" data-idlocal="{{$nombrearea->id_restaurante}}" data-ida ="{{$nombrearea->id}}">{{$nombrearea->nombre}}</a>
          {{HTML::linkAsset('logout', 'Salir')}}
          @endif
      </section>

      <section class="right-small">
        <a class="right-off-canvas-toggle menu-icon" ><span></span></a>
      </section>
    </nav>

    <aside class="left-off-canvas-menu">
      <ul class="off-canvas-list">
          @section('mesas_bar')

          @show
      </ul>
    </aside>
    <aside class="right-off-canvas-menu">
      <ul class="off-canvas-list" id="platos">
      @if(isset($platos))
      @foreach ($platos as $plato)
      <li class="{{$plato->estado}}" data-estado="{{$plato->estado}}" data-iddetped="{{$plato->detpedid}}">{{$plato->pnombre}} x 1 ({{$plato->nombre}})</li>
      @endforeach
      @endif
      </ul>
    </aside>

    <section class="main-section">
      
        @yield('main_section')

    </section>

  <a class="exit-off-canvas"></a>

  </div>
</div>

<!--</div></div>-->

<div id="myModal" class="reveal-modal" data-reveal>
</div>

<div id="leanmodal" style="background-color:white;"></div>



  <div class="row">
      <div class="small-12 medium-11 large-9 columns large-centered medium-centered small-centered">
          @yield('content')
      </div>
  </div>

  <!--<footer id="footer_pedido">-->
    
  <!--</footer>-->

  @section('jsgeneral')
  <script src="http://192.168.1.15:3000/socket.io/socket.io.js"></script>
  {{HTML::script('js/vendor/modernizr.js'); }}
  {{HTML::script('js/vendor/jquery.js'); }}
  {{HTML::script('js/jquery-ui-1.10.4.custom.min.js');}}
  {{HTML::script('js/foundation.min.js'); }}
  {{HTML::script('js/under.js'); }}
  {{HTML::script('js/jquery.plugin.js'); }}
  {{HTML::script('js/jquery.timeentry.min.js'); }}
  {{HTML::script('js/alertify.min.js'); }}
  {{HTML::script('js/jquery.tooltipster.min.js'); }}
  {{HTML::script('js/easymodal/jquery.easyModal.js'); }}
  {{HTML::script('js/general.js'); }}
  {{HTML::script('js/general2.js'); }}
  {{HTML::script('js/pedidos.js'); }}
  @show
  
    <script>
      $(document).foundation();
    </script>
@yield('js')
</body>
</html>
