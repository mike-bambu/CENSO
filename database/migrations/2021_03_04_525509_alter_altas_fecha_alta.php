<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAltasFechaAlta extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('altas', function (Blueprint $table) {

            $table->date('fecha_alta')->nullable()->index()->after('folio_alta');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('altas', function (Blueprint $table) {
            
            $table->dropColumn('fecha_alta');
            
        });
    }
}
