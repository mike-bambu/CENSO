<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class AltaDiagnostico extends Model
{
    protected $table = 'alta_diagnostico';

    public function altaDiagnostico()
    {
        return $this->belongsTo('App\Models\Sistema\Alta', 'alta_id', 'id')->with("diagnosticos");
    }
}
