<?php

namespace App\Models\Catalogos;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class EstadosRepublica extends Model
{
    protected $table = 'estados_republica';
    protected $fillable = ["id", "nombre"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}
