<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEspecialidadesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('especialidades', function (Blueprint $table) {

            $table->smallIncrements('id')->unsigned();
            $table->string('nombre')->index();

            $table->string('clues_id')->index();

            $table->timestamps();
            $table->softDeletes();

        });

        Schema::table('especialidades', function($table) {
            
            $table->foreign('clues_id')->references('id')->on('clues')->onUpdate('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('especialidades');
    }
}
