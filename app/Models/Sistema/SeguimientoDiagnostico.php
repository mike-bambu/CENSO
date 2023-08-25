<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class SeguimientoDiagnostico extends Model
{
    protected $table = 'seguimiento_diagnostico';
    protected $fillable = [
        'id',
        'folio_seguimiento_diagnostico',
        'seguimiento_id',
        'diagnostico_id'
    ];

    public function seguimientoDiagnostico()
    {
        return $this->belongsTo('App\Models\Sistema\Seguimiento', 'seguimiento_id', 'id')->with("diagnosticos");
    }

}
