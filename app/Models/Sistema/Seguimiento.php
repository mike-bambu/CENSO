<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Seguimiento extends Model
{
    protected $table = 'seguimientos';
    protected $fillable = [
        'id',
        'fecha_seguimiento',
        'hora_seguimiento',
        'folio_seguimiento',
        'observaciones',
        'observaciones_diagnosticos',
        'cama_id',
        'servicio_id',
        'atencion_id',
        'estado_actual_id',
        'factor_covid_id'
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function diagnosticos(){

        return $this->belongsToMany('App\Models\Sistema\Diagnostico', 'seguimiento_diagnostico', 'seguimiento_id', 'diagnostico_id');
    }
    public function servicio(){

        return $this->belongsTo('App\Models\Catalogos\Servicio', 'servicio_id');
    }
    public function cama(){

        return $this->belongsTo('App\Models\Catalogos\Camas', 'cama_id', 'id');

    }
    public function especialidad(){

        return $this->belongsTo('App\Models\Catalogos\Especialidad', 'especialidad_id');
    }
    public function estado_actual(){

        return $this->belongsTo('App\Models\Catalogos\EstadoActual', 'estado_actual_id');
    }
    public function factor_covid(){

        return $this->belongsTo('App\Models\Catalogos\FactorCovid', 'factor_covid_id');
    }

}
