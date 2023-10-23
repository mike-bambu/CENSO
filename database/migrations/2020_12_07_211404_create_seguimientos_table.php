<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeguimientosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seguimientos', function (Blueprint $table) {
            
            $table->smallIncrements('id')->unsigned();
            $table->string('folio_seguimiento')->index();
            $table->date('fecha_seguimiento')->nullable()->index();
            $table->string('hora_seguimiento')->nullable();
            $table->string('observaciones')->nullable();
            $table->string('observaciones_diagnosticos')->nullable();
            $table->smallInteger('servicio_id')->unsigned()->index();
            $table->smallInteger('cama_id')->unsigned()->nullable()->index();
            $table->string('no_cama')->nullable()->index();
            $table->bigInteger('atencion_id')->unsigned()->index();
            $table->smallInteger('estado_actual_id')->unsigned()->index();
            $table->smallInteger('especialidad_id')->unsigned()->nullable()->index();
            $table->smallInteger('factor_covid_id')->unsigned()->nullable()->index();

            $table->timestamps();
            $table->softDeletes();
            
        });
        Schema::table('seguimientos', function($table) {
            
            $table->foreign('servicio_id')->references('id')->on('servicios')->onUpdate('cascade');
            $table->foreign('cama_id')->references('id')->on('camas')->onUpdate('cascade');
            $table->foreign('atencion_id')->references('id')->on('atenciones')->onUpdate('cascade');
            $table->foreign('estado_actual_id')->references('id')->on('estados_actuales')->onUpdate('cascade');
            $table->foreign('factor_covid_id')->references('id')->on('factor_covid')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seguimientos');
    }
}
