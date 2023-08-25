<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Diagnostico extends Model
{
    protected $table = 'diagnosticos';
    protected $fillable = ["id", "nombre"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function seguimiento(){

        return $this->belongsToMany('App\Models\Sistema\Seguimiento', 'seguimiento_diagnostico', 'diagnostico_id', 'seguimiento_id');
        
    }
}
