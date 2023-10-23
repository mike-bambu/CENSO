<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    public $incrementing = true;
    protected $primaryKey = 'id';
    protected $table = 'pacientes';
    protected $fillable = [

        'id',
        'folio_paciente',
        'numero_expediente',
        'tieneAtencion',
        'nombre',
        'paterno',
        'materno',
        'edad',
        'edad_aparente',
        'sexo',
        'fecha_nacimiento',
        'curp',
        'estado_republica_id',
        'municipio_id',
        'localidad_id',
        'esDesconocido',
        'alias',
        'esExtranjero',
        'pais_origen_id',
        'telefono_emergencia',
        'telefono_celular',
        'calle',
        'colonia',
        'no_exterior',
        'no_interior',
        'entreCalles',
        'cp',
        'user_id',
    ];

    public function estado_republica(){

        return $this->belongsTo('App\Models\Catalogos\EstadosRepublica', 'estado_republica_id');
    }

    public function municipio(){

        return $this->belongsTo('App\Models\Catalogos\Municipio', 'municipio_id');
    }

    public function localidad(){

        return $this->belongsTo('App\Models\Catalogos\Localidad', 'localidad_id');
    }

    public function pais_origen(){

        return $this->belongsTo('App\Models\Catalogos\Pais', 'pais_origen_id');
    }

    public function atenciones(){

        return $this->hasMany('App\Models\Sistema\Atencion', 'paciente_id', 'id')->with('seguimientos', 'clues', 'estado_actual', 'servicio_atencion', 'cama_atencion', 'especialidad');
        //return $this->hasMany('App\Models\Sistema\Atencion', 'paciente_id', 'id')->with('seguimientos', 'clues', 'estado_actual', 'metodo_gestacional', 'clues_referencia', 'clue_atencion_embarazo', 'clues_control_embarazo')->skip(20)->take(20);
    }

    public function embarazo(){

        return $this->hasOne('App\Models\Sistema\Embarazo', 'paciente_id')->with('clues_referencia', 'clue_atencion_embarazo', 'clues_control_embarazo', 'metodo_gestacional');
    }

    public function ultimaAtencion(){

        return $this->hasOne('App\Models\Sistema\Atencion', 'paciente_id', 'id')->orderBy('id', 'DESC')
        ->with('seguimientos', 'alta', 'clues', 'especialidad',
        'cama_actual',
        'servicio_actual',
        'ultimo_estado_actual',
        'ultima_especialidad',
        'clues_referencia',
        'ultimoSeguimiento',
        'estado_actual',
        'servicio_atencion',
        'cama_atencion',
        );
    }

    public function ultimaAtencionAlta(){

        return $this->hasOne('App\Models\Sistema\Atencion', 'paciente_id', 'id')->orderBy('id', 'DESC')->with('alta', 'clues', 'estado_actual','clues_referencia');
    }

    public function primeraAtencion(){

        return $this->hasOne('App\Models\Sistema\Atencion', 'paciente_id', 'id')->orderBy('id', 'ASC')->with('seguimientos', 'alta', 'clues', 'estado_actual', 'cama', 'servicio', 'clues_referencia');
    }
    
}
