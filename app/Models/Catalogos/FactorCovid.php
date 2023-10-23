<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FactorCovid extends Model
{
    //use SoftDeletes;
    protected $table = 'factor_covid';
    protected $fillable = ["id", "nombre"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
}
