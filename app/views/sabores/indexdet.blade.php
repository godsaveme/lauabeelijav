@extends('layouts.master')


@section('content')
@parent
@stop 
@section('sub-content')
  @parent
<a id="cntnr1" style="opacity: 0;" href="{{URL('sabores/createdet')}}" class='pull-right btn btn-primary'><i class="fa fa-edit"></i> Crear Sabor a Producto</a>

<div id="cntnr2" style="opacity: 0;" class="panel-heading"><strong><i class="glyphicon glyphicon-th"></i> Productos con Sabores
</strong></div>





<div id="cntnrGrid" style="opacity: 0;">

<div class="panel-body">


    <table id="gridSabores">
                    <colgroup>
                    <col style="width:120px" />
                    <col style="width:150px"  />
                    <col style="width:120px" />
                    <col style="width:80px" />
                    <col style="width:120px" />
                    <col style="width:130px" />
                </colgroup>
      <thead>
        <tr>
          <th data-field="nombre">Nombre Producto</th>
          <th data-field="descripcion">Sabores Relacionados</th>
          <th data-field="editar">Editar</th>
          <th data-field="eliminar">Eliminar</th>
        </tr>
      </thead>
      <tbody>
        @foreach($prod_sabor as $ps)
        <tr>
          <td>{{$ps->nombre}}</td>
          <td> @foreach($ps->sabores as $dato) {{$dato->nombre.', '}} @endforeach  </td>
          <td><a href="/sabores/editdet/{{$ps->id}}" type="button" class="k-button">
        <!-- <span class="glyphicon glyphicon-pencil"></span> -->
                <span class="k-icon k-i-pencil"></span>
        Editar
      </a></td>
          <td><a onclick="onDestroy('/sabores/destroydet/{{$ps->id}}','/sabores/indexdet');" href="#" type="button" class="k-button">
        <!-- <span class="glyphicon glyphicon-remove"></span> -->
        <span class="k-icon k-i-close"></span>
      Eliminar
        </a></td>
        </tr>
        @endforeach
      </tbody>
    </table>


</div> <!-- del panel body -->

  </div>

@stop
