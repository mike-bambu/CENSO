<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisitaPuerperal extends Model
{
    use SoftDeletes;
    protected $fillable = ['name'];

    public function permissions(){
        return $this->belongsToMany('App\Models\Permission');
    }
}
