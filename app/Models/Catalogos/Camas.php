<?php

namespace App\Models\Catalogos;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Camas extends Model
{
    //use HasFactory;

    use SoftDeletes;
    protected $primaryKey = 'id';
    protected $table = 'camas';    
    protected $fillable = ["id", "numero", "folio", "descripcion", "tipo_cama", "clues_id", "servicio_id", "estatus_cama_id"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];


    public function clues(){
        
        return $this->belongsTo('App\Models\Catalogos\Clue','clues_id','id');
    }

    public function servicio(){
        
        return $this->belongsTo('App\Models\Catalogos\Servicio','servicio_id');
    }

    public function estatus_cama(){
        
        return $this->belongsTo('App\Models\Catalogos\EstatusCama','estatus_cama_id');
    }

    
}
