<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAtencionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('atenciones', function (Blueprint $table) {

            $table->id(); //biginteger
            $table->string('folio_atencion')->index();
            $table->boolean('esAmbulatoria')->unsigned()->index();
            $table->boolean('dadodeAlta')->unsigned()->nullable();
            $table->boolean('esUrgenciaCalificada')->unsigned()->nullable()->index();
            $table->date('fecha_inicio_atencion')->nullable()->index();
            $table->string('hora')->nullable();
            $table->smallInteger('estado_actual_id')->unsigned()->nullable();
            $table->smallInteger('servicio_id')->unsigned()->nullable()->index();
            $table->smallInteger('cama_id')->unsigned()->nullable()->index();
            $table->string('no_cama')->nullable()->index();
            $table->string('motivo_atencion')->nullable();
            $table->string('indicaciones')->nullable();
            $table->boolean('estaEmbarazada')->unsigned()->nullable();
            $table->boolean('haEstadoEmbarazada')->unsigned()->nullable();
	        $table->boolean('codigoMater')->unsigned()->index()->nullable();

            $table->string('clues_id')->nullable()->index();
            $table->smallInteger('paciente_id')->unsigned()->index();
            
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('atenciones', function($table) {
            $table->foreign('estado_actual_id')->references('id')->on('estados_actuales')->onUpdate('cascade');
            $table->foreign('servicio_id')->references('id')->on('servicios')->onUpdate('cascade');
            $table->foreign('cama_id')->references('id')->on('camas')->onUpdate('cascade');
            $table->foreign('clues_id')->references('id')->on('clues')->onUpdate('cascade');
            $table->foreign('paciente_id')->references('id')->on('pacientes')->onUpdate('cascade');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('atenciones');
    }
}
