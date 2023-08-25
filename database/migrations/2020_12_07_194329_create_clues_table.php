<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCluesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clues', function (Blueprint $table) {

            //$table->integer('id')->unsigned();
            $table->string('id', 12)->primary()->comment('CLave Unica de Establecimientos de Salud')->index();
            $table->string('abreviacion', 50)->nullable();
			$table->string('nombre', 120)->comment('Nombre de la unidad de salud')->index();
			$table->string('domicilio', 200)->comment('Direccion de la unidad de salud, calle, numero, colonia, ciudad o municipio.');
			$table->integer('codigoPostal');
			$table->float('numeroLongitud', 10, 0)->nullable();
			$table->float('numeroLatitud', 10, 0)->nullable();
			$table->string('entidad', 50);
			$table->string('estado', 60);
            $table->string('institucion', 80);
            $table->smallInteger('distritos_id')->unsigned();
            $table->string('localidad', 70);
            $table->smallInteger('municipios_id')->unsigned()->comment('Municipio al que pertenece la CLUES');
            $table->string('tipologia', 70);
            $table->string('nivelAtencion', 50);            
            $table->boolean('activo')->nullable();

        });

        Schema::table('clues', function($table) {
            $table->foreign('distritos_id')->references('id')->on('distritos')->onUpdate('cascade');
            $table->foreign('municipios_id')->references('id')->on('municipios')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clues');
    }
}
