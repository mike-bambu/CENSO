<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCamasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('camas', function (Blueprint $table) {

            $table->smallIncrements('id')->unsigned();
            $table->string('numero')->index();
            $table->string('folio')->nullable()->index();
            $table->string('descripcion')->nullable();
            $table->string('tipo_cama')->nullable();
            
            $table->string('clues_id')->index();
            $table->smallInteger('servicio_id')->unsigned();
            $table->smallInteger('estatus_cama_id')->unsigned();
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('camas', function($table) {
            
            $table->foreign('clues_id')->references('id')->on('clues')->onUpdate('cascade');
            $table->foreign('servicio_id')->references('id')->on('servicios')->onUpdate('cascade');
            $table->foreign('estatus_cama_id')->references('id')->on('estatus_cama')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('camas');
    }
}
