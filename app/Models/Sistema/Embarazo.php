<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Embarazo extends Model
{
    protected $table = 'embarazos';
    protected $fillable = [
        
        'id',
        'fueReferida',
        'gestas',
        'partos',
        'cesareas',
        'abortos',
        'fecha_ultima_mestruacion',
        'fecha_control_embarazo',
        'semanas_gestacionales',
        'fecha_ultimo_parto',
        'puerperio',
        'metodo_gestacional_id',
        'clues_referencia_id',
        'clue_atencion_embarazo_id',
        'fecha_ultima_atencion_embarazo',
        'clues_control_embarazo_id',
        'paciente_id',
        
    ];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function paciente(){

        return $this->belongsTo('App\Models\Sistema\Paciente', 'paciente_id', 'id');

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


    public function metodo_gestacional(){

        return $this->belongsTo('App\Models\Catalogos\MetodoGestacional', 'metodo_gestacional_id', 'id');

    }


}
