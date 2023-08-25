<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Alta extends Model
{
    public $incrementing = true;
    protected $table = 'altas';
    protected $fillable = [
        'id',
        'folio_alta',
        'fecha_alta',
        'hora_alta',
        'observaciones',
        'observaciones_diagnosticos',
        'fecha_alta',
        'dias_hospitalizado',
        'telefono',
        'direccion_completa',
        'motivo_egreso_id',
        'condicion_egreso_id',
        'estado_actual_id',
        'metodo_anticonceptivo_id',
        'municipio_id',
        'localidad_id',
        'atencion_id'
    ];


    public function ultimaAtencion(){

        return $this->hasOne('App\Models\Sistema\Atencion', 'id', 'atencion_id')->orderBy('id', 'DESC')->with('paciente', 'seguimientos', 'clues', 'estado_actual', 'metodo_gestacional', 'clues_referencia');
    }

    public function motivoEgreso(){

        return $this->belongsTo('App\Models\Catalogos\MotivoEgreso', 'motivo_egreso_id');
        
    }

    public function condicionEgreso(){

        return $this->belongsTo('App\Models\Catalogos\CondicionEgreso', 'condicion_egreso_id');
        
    }

    public function estadoActual(){

        return $this->belongsTo('App\Models\Catalogos\EstadoActual', 'estado_actual_id');
        
    }

    public function metodoAnticonceptivo(){

        return $this->belongsTo('App\Models\Catalogos\MetodoAnticonceptivo', 'metodo_anticonceptivo_id');
        
    }

    public function municipio(){

        return $this->belongsTo('App\Models\Catalogos\Municipio', 'municipio_id');
    }

    public function localidad(){

        return $this->belongsTo('App\Models\Catalogos\Localidad', 'localidad_id');
    }

    public function diagnosticos(){

        return $this->belongsToMany('App\Models\Sistema\Diagnostico', 'alta_diagnostico', 'alta_id', 'diagnostico_id');

    }
}
