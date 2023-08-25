<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Clue extends Model
{
    //use SoftDeletes;
    protected $table = 'clues';
    protected $fillable = [
        'id',
        'abreviacion',
        'nombre',
        'domicilio',
        'codigoPostal',
        'numeroLongitud',
        'numeroLatitud',
        'entidad',
        'estado',
        'institucion',
        'distritos_id',
        'localidad',
        'municipios_id',
        'tipologia',
        'nivelAtencion',
        'activo'
    ];
    public $incrementing = false;
    protected $keyType = 'string';

    public function usuarios(){
        return $this->belongsToMany('App\Models\User');
    }

    public function distrito(){
        return $this->belongsTo('App\Models\Catalogos\Distrito', 'distritos_id', 'id');
    }

    public function pacientes(){
        return $this->hasMany('App\Models\Sistema\Paciente', 'clues', 'id');
    }
}