<?php

class Horcomb extends Eloquent {

	protected $table = 'horComb';
	
	protected $guarded = array();

	public static $rules = array();

	public function dias(){
		return $this->belongsToMany('Dias','det_dias','horcomb_id','dias_id');

	}
}