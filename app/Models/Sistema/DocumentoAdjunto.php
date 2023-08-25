<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentoAdjunto extends Model
{
    use SoftDeletes;
    protected $table = 'documentos_adjuntos';
    protected $fillable = ["id", "url_documento", "extension_documento", "paciente_id"];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
}
