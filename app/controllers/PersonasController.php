<?php

class PersonasController extends BaseController {

	public function getIndex()
	{
		$personas = Persona::where('razonSocial', '=', NULL)->leftJoin('perfil', 'perfil.id', '=', 'persona.perfil_id')
		->select('persona.id', 'persona.nombres', 'persona.apPaterno', 'persona.apMaterno','perfil.nombre as PerfilNombre')->get();
        return View::make('personas.index', compact('personas'));
	}

	public function getEmpresas()
	{
		$empresas = Persona::where('nombres', '=', NULL)->leftJoin('perfil', 'perfil.id', '=', 'persona.perfil_id')
		->select('persona.id', 'persona.razonSocial','perfil.nombre as PerfilNombre')->get();
        return View::make('personas.indexem', compact('empresas'));
	}

	public function getCreate()
	{
		$departamentos = Ubigeo::select()->groupBy('departamento')->get();
		$perfiles = Perfil::select()->where('selector', '=', 1)->get();
        return View::make('personas.create', compact('departamentos','perfiles'));
	}
	public function getCreateempresas()
	{
		$departamentos = Ubigeo::select()->groupBy('departamento')->get();
		$perfiles = Perfil::select()->where('selector', '=', 2)->get();
        return View::make('personas.createem', compact('departamentos','perfiles'));
	}


	public function postStore()
	{
		DB::beginTransaction();	
			try {
				$persona = Persona::create(Input::all());
				DB::commit();
			} catch (Exception $e) {
					DB::rollback();
			}
		
		return Redirect::to('personas');
	}

	public function postStoreem()
	{
		DB::beginTransaction();	
			try {
				$persona = Persona::create(Input::all());
			} catch (Exception $e) {
						DB::rollback();
			}
		DB::commit();
		return Redirect::to('personas/empresas');
	}


	public function show($id)
	{
        return View::make('personas.show');
	}

	
	public function getEdit($id)
	{
		$persona = Persona::find($id);
		$departamentos = Ubigeo::select()->groupBy('departamento')->get();
		$perfiles = Perfil::select()->where('selector', '=', 1)->get();
        return View::make('personas.edit', compact('persona','departamentos', 'perfiles'));
	}

	public function getEditem($id)
	{
		$empresa = Persona::find($id);
		$departamentos = Ubigeo::select()->groupBy('departamento')->get();
		$perfiles = Perfil::select()->where('selector', '=', 2)->get();
        return View::make('personas.editem', compact('empresa','departamentos', 'perfiles'));
	}


	public function postEdit()
	{
		$persona = Persona::find(Input::get('id'));
		$persona->update(Input::all());
		$persona->save();
		return Redirect::to('personas');
	}

	public function postUpdateem()
	{
		$persona = Persona::find(Input::get('id'));
		$persona->update(Input::all());
		$persona->save();

		return Redirect::to('personas/empresas');
	}

	public function postDestroy($id)
	{
		DB::beginTransaction();	

		try {

			$persona = Persona::find($id);
			$persona->delete();

		} catch (Exception $e) {
			DB::rollback();
			return Response::json(false);
		}

		DB::commit();
		return Response::json(true);

	}

	public function postDestroyem($id)
	{


		DB::beginTransaction();	

		try {

			$persona = Persona::find($id);
			$persona->delete();

		} catch (Exception $e) {
			DB::rollback();
			return Response::json(false);
		}

		DB::commit();
		return Response::json(true);
	}

}
