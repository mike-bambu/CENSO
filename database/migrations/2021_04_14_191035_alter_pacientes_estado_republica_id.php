<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterPacientesEstadoRepublicaId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes', function (Blueprint $table) {

            $table->smallInteger('estado_republica_id')->unsigned()->nullable()->index()->after('curp');
            $table->foreign('estado_republica_id')->references('id')->on('estados_republica')->onUpdate('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pacientes', function (Blueprint $table) {
            
            $table->dropColumn('estado_republica_id');
            
        });
    }
}
