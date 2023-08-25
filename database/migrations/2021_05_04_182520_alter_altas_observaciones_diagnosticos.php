<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAltasObservacionesDiagnosticos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('altas', function (Blueprint $table) {

            $table->string('observaciones_diagnosticos', 1000)->nullable()->index()->after('observaciones');
            $table->string('hora_alta')->nullable()->after('fecha_alta');

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

            $table->dropColumn('observaciones_diagnosticos');
            $table->dropColumn('hora_alta');
        });
    }
}
