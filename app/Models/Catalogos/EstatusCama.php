<?php

namespace App\Models\Catalogos;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstatusCama extends Model
{
    //use HasFactory;

    //use SoftDeletes;

    protected $table = 'estatus_cama';    
    protected $fillable = ["id", "nombre", "descripcion"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"]; 
}
