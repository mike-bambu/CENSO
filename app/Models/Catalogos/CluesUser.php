<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CluesUser extends Model
{

    protected $table = "clue_user";
    protected $fillable = ["clues_clues", "users_id"];

    /*public function clue()
    {
        return $this->belongsTo(User::class,'clues_clues','clues');
    }*/

    public function clue()
    {
        return $this->hasOne("App\Models\Catalogos\Clues",'clues', 'clues_clues')->select("clues", "nombre_entidad");
    }
}
