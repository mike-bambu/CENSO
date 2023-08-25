<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MetodoAnticonceptivo extends Model
{
    protected $table = 'metodos_anticonceptivos';
    protected $fillable = ["id", "nombre"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
}
