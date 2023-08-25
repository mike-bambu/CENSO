<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Distrito extends Model
{
    protected $table = 'distritos';
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function municipios(){
        return $this->hasMany('App\Models\Catalogos\Municipio','distritos_id', 'id');
    }

    public function clues(){
        return $this->hasMany('App\Models\Catalogos\Clue','distritos_id', 'id');
    }

}
