<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAtencionesUbicacionActual extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('atenciones', function (Blueprint $table) {

            $table->smallInteger('ultimo_servicio_id')->unsigned()->nullable()->index()->after('paciente_id');
            $table->smallInteger('ultima_cama_id')->unsigned()->nullable()->index()->after('ultimo_servicio_id');
            $table->smallInteger('ultimo_no_cama')->unsigned()->nullable()->index()->after('ultima_cama_id');
            $table->smallInteger('ultimo_estado_actual_id')->unsigned()->nullable()->index()->after('ultimo_no_cama');
            $table->smallInteger('ultima_especialidad_id')->unsigned()->nullable()->index()->after('ultimo_estado_actual_id');
            $table->smallInteger('ultimo_factor_covid_id')->unsigned()->nullable()->index()->after('ultima_especialidad_id');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('atenciones', function (Blueprint $table) {
            
            $table->dropColumn('ultimo_servicio_id');
            $table->dropColumn('ultima_cama_id');
            $table->dropColumn('ultimo_no_cama');
            $table->dropColumn('ultimo_estado_actual_id');
            $table->dropColumn('ultima_especialidad_id');
            $table->dropColumn('ultimo_factor_covid_id');
            
        });
    }
}
