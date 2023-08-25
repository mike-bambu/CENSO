<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Atencion extends Model
{
    protected $table = 'atenciones';
    protected $fillable = [

        'folio_atencion',
        'esAmbulatoria',
        'dadodeAlta',
        'esUrgenciaCalificada',
        'fecha_inicio_atencion',
        'hora',
        'estado_actual_id',
        'servicio_id',
        'cama_id',
        'no_cama',
        'motivo_atencion',
        'indicaciones',
        'estaEmbarazada',
        'haEstadoEmbarazada',
        'codigoMater',
        'clues_id',
        'paciente_id',
        'ultima_cama_id',
        'ultimo_servicio_id',
        'ultimo_estado_actual_id',
        'ultima_especialidad_id',
        
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function paciente(){

        return $this->belongsTo('App\Models\Sistema\Paciente', 'paciente_id', 'id');

    }

    public function clues(){

        return $this->belongsTo('App\Models\Catalogos\Clue', 'clues_id', 'id');

    }

    public function seguimientos(){

        //return $this->hasMany('App\Models\Sistema\Seguimiento', 'atencion_id', 'id')->with('diagnosticos', 'servicio', 'estado_actual', 'factor_covid');
        return $this->hasMany('App\Models\Sistema\Seguimiento', 'atencion_id', 'id')->with('servicio', 'estado_actual', 'cama', 'factor_covid', 'especialidad');


    }

    public function ultimoSeguimiento(){

        return $this->hasOne('App\Models\Sistema\Seguimiento', 'atencion_id', 'id')->orderBy('id', 'DESC')->with('servicio', 'estado_actual', 'cama', 'especialidad', 'factor_covid');
    }

    public function alta(){

        return $this->hasOne('App\Models\Sistema\Alta', 'atencion_id', "id")->orderBy('id')->with("motivoEgreso")->with("condicionEgreso")->with("estadoActual")->with("municipio")->with("localidad")->with("diagnosticos")->with("metodoAnticonceptivo");
    }

    public function clues_referencia(){

        return $this->belongsTo('App\Models\Catalogos\Clue', 'clues_referencia_id', 'id');

    }

    public function clue_atencion_embarazo(){

        return $this->belongsTo('App\Models\Catalogos\Clue', 'clue_atencion_embarazo_id', 'id');

    }

    public function clues_control_embarazo(){

        return $this->belongsTo('App\Models\Catalogos\Clue', 'clues_control_embarazo_id', 'id');

    }

    // como entro al hospital
    public function estado_actual(){

        return $this->belongsTo('App\Models\Catalogos\EstadoActual', 'estado_actual_id', 'id');

    }

    public function servicio_atencion(){

        return $this->belongsTo('App\Models\Catalogos\Servicio', 'servicio_id', 'id');

    }
    
    public function cama_atencion(){

        return $this->belongsTo('App\Models\Catalogos\Camas', 'cama_id', 'id');

    }

    public function especialidad(){

        return $this->belongsTo('App\Models\Catalogos\Especialidad', 'especialidad_id', 'id');

    }

    //ubicacion actual del paciente

    public function cama_actual(){

        return $this->belongsTo('App\Models\Catalogos\Camas', 'ultima_cama_id', 'id');

    }

    public function servicio_actual(){

        return $this->belongsTo('App\Models\Catalogos\Servicio', 'ultimo_servicio_id', 'id');

    }

    public function ultimo_estado_actual(){

        return $this->belongsTo('App\Models\Catalogos\EstadoActual', 'ultimo_estado_actual_id', 'id');

    }

    public function ultima_especialidad(){

        return $this->belongsTo('App\Models\Catalogos\Especialidad', 'ultima_especialidad_id', 'id');

    }
    //ultimo_factor_covid_id



}
