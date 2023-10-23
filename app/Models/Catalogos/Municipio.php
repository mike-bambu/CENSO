<?php

namespace App\Models\Catalogos;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
    protected $table = 'municipios';
    protected $fillable = ["id", "clave", "nombre", "distritos_id"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];


    // public function localidades(){
    //     return $this->hasMany('App\Models\Catalogos\Localidad');
    // }

    public function localidades(){
        return $this->hasMany('App\Models\Catalogos\Municipio','municipio_id','id');
    }
    
    public function distrito(){
        return $this->belongsTo('App\Models\Catalogos\Distritos','distritos_id','id');
    }

}
