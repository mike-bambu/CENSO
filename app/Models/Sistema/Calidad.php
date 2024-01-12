<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Calidad extends Model
{
    public $incrementing = true;
    protected $primaryKey = 'id';
    protected $table = 'quality_measurements';
    protected $fillable = [
        'id',
        'user_id',
        'clues_id',
        'is_active',
        'total_files',
        'reviewed_files',
        'measurement_type',
        'date_start',
        'date_finish',
        'last_folio_file'
    ];
}
