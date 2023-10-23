<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeguimientoDiagnosticoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seguimiento_diagnostico', function (Blueprint $table) {

            $table->smallIncrements('id')->unsigned();
            $table->string('folio_seguimiento_diagnostico')->index();
            $table->smallInteger('seguimiento_id')->unsigned();
            $table->smallInteger('diagnostico_id')->unsigned()->index();
            
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::table('seguimiento_diagnostico', function($table) {
            $table->foreign('seguimiento_id')->references('id')->on('seguimientos')->onUpdate('cascade');
            $table->foreign('diagnostico_id')->references('id')->on('diagnosticos')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seguimiento_diagnostico');
    }
}
