<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CondicionEgreso extends Model
{
    use SoftDeletes;
    protected $table = 'condiciones_egresos';
}
