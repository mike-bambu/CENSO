<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Localidad extends Model
{


    protected $table = 'localidades';
    protected $fillable = ["id", "clave", "nombre", "numeroLatitud", "numeroLongitud", "numeroAltitud", "claveCarta", "entidades_id", "municipios_id"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];


    public function municipios()
    {
        return $this->belongsTo('App\Models\Catalogos\Municipio', 'municipios_id');
    }

}
