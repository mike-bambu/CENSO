<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Servicio extends Model
{
    //use SoftDeletes;

    protected $table = 'servicios';    
    protected $fillable = ["id", "nombre", "es_ambulatorio", "clues_id"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"]; 

    public function clues(){
        
        return $this->belongsTo('App\Models\Catalogos\Clue','clues_id','id');
    }
}
