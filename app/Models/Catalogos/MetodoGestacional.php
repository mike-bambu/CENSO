<?php

namespace App\Models\Catalogos;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class MetodoGestacional extends Model
{
    use SoftDeletes;
    protected $table = 'metodos_gestacionales';
    protected $fillable = ["id", "nombre"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
}
