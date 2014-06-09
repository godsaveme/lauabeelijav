@extends('layouts.master')


@section('content')
@parent
@stop 
@section('sub-content')
  @parent
<a id="cntnr1" style="opacity: 0;" href="{{URL('notas/create')}}" class='pull-right btn btn-primary'><i class="fa fa-edit"></i> Crear Nota</a>

<div id="cntnr2" style="opacity: 0;" class="panel-heading"><strong><i class="glyphicon glyphicon-th"></i> NOTAS
</strong></div>

                    

<div id="cntnrGrid" style="opacity: 0;">

<div class="panel-body" style="position:relative; overflow:hidden;">


    <table id="gridNotas">
                        <colgroup>
                    <col style="width:120px" />
                    <col style="width:150px"  />
                    <col style="width:120px" />
                    <col style="width:130px" />
                </colgroup>
      <thead>
        <tr>
          <th data-field="numero">Número</th>
          <th data-field="nota">Nota</th>
          <th data-field="editar">Editar</th>
          <th data-field="eliminar">Eliminar</th>
        </tr>
      </thead>
      <tbody>
        @foreach ($notas as $dato)
        <tr>
          <td>{{$dato->id}}</td>
          <td>{{$dato->descripcion}}</td>
          <td><a href="notas/edit/{{$dato->id}}" type="button" class="k-button">
        <!-- <span class="glyphicon glyphicon-pencil"></span> -->
                <span class="k-icon k-i-pencil"></span>
        Editar
      </a></td>
          <td><a onclick="onDestroy('notas/destroy/{{$dato->id}}','notas');" href="#" type="button" class="k-button">
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