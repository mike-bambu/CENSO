<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmbarazosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('embarazos', function (Blueprint $table) {

            $table->id(); //biginteger
            $table->boolean('fueReferida')->unsigned()->nullable();
            $table->integer('gestas')->unsigned()->nullable();
            $table->integer('partos')->unsigned()->nullable();
            $table->integer('cesareas')->unsigned()->nullable();
            $table->integer('abortos')->unsigned()->nullable();
            $table->date('fecha_ultima_mestruacion')->nullable()->index();
            $table->date('fecha_control_embarazo')->nullable()->index();
            $table->decimal('semanas_gestacionales')->unsigned()->nullable();
            
            $table->date('fecha_ultimo_parto')->nullable()->index();
            $table->boolean('puerperio')->unsigned()->nullable();

            $table->smallInteger('metodo_gestacional_id')->unsigned()->nullable();
            $table->string('clues_referencia_id')->nullable();
            $table->string('clue_atencion_embarazo_id')->nullable();
            $table->date('fecha_ultima_atencion_embarazo')->nullable()->index();
            $table->string('clues_control_embarazo_id')->nullable();

            $table->smallInteger('paciente_id')->unsigned()->index();


            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('embarazos', function($table) {

            $table->foreign('metodo_gestacional_id')->references('id')->on('metodos_gestacionales')->onUpdate('cascade');
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
        
        Schema::dropIfExists('embarazos');
        
    }
}
