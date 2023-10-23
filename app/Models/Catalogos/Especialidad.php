<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Especialidad extends Model
{
    use SoftDeletes;
    protected $table = 'especialidades';
    protected $fillable = ["id", "nombre"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function clues(){
        
        return $this->belongsTo('App\Models\Catalogos\Clue','clues_id','id');
    }

}
