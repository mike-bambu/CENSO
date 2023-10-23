<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePacientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pacientes', function (Blueprint $table) {

            $table->smallIncrements('id')->unsigned();
            $table->string('folio_paciente')->nullable()->index();
            $table->string('numero_expediente')->nullable()->index();
            $table->boolean('tieneAtencion')->unsigned()->nullable();
            $table->string('nombre')->nullable()->index();
            $table->string('paterno')->nullable()->index();
            $table->string('materno')->nullable()->index();
            $table->integer('edad')->unsigned()->nullable()->index();
            $table->integer('edad_aparente')->unsigned()->nullable()->index();
            $table->string('sexo')->nullable()->index();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('curp')->nullable()->index();
            $table->smallInteger('municipio_id')->unsigned()->nullable()->index();
            $table->smallInteger('localidad_id')->unsigned()->nullable()->index();

            $table->boolean('esDesconocido')->unsigned()->nullable();
            $table->string('alias')->nullable();

            $table->boolean('esExtranjero')->unsigned()->nullable();
            $table->smallInteger('pais_origen_id')->unsigned()->nullable()->index();

            $table->string('telefono_emergencia')->nullable()->index();
            $table->string('telefono_celular')->nullable()->index();


            $table->string('calle')->nullable();
            $table->string('colonia')->nullable();
            $table->string('no_exterior')->nullable();
            $table->string('no_interior')->nullable();
            $table->string('entreCalles')->nullable();
            $table->string('cp')->nullable();


            $table->bigInteger('user_id')->unsigned();

            $table->timestamps();
            $table->softDeletes();

        });

        Schema::table('pacientes', function($table) {

            $table->foreign('municipio_id')->references('id')->on('municipios')->onUpdate('cascade');
            $table->foreign('localidad_id')->references('id')->on('localidades')->onUpdate('cascade');
            $table->foreign('pais_origen_id')->references('id')->on('paises')->onUpdate('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pacientes');
    }
}
