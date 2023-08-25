<?php

namespace App\Models\Catalogos;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Pais extends Model
{
    protected $table = 'paises';
    protected $fillable = ["id", "codigo", "nombre"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

}