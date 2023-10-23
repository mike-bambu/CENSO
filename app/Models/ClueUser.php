<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClueUser extends Model
{
    protected $fillable = [ 'clue_id', 'user_id', 'dispositivo_id' ];
    public $incrementing = false;

    // public function userClue()
    // {
    //     return $this->belongsTo('App\Models\User', 'user_id', 'id')->with("clues");
    // }
}
