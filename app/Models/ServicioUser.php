<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicioUser extends Model
{
    protected $table = "servicio_user";
    protected $fillable = ["user_id","servicio_id"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
    

}
