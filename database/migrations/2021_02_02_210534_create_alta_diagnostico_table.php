<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAltaDiagnosticoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('alta_diagnostico', function (Blueprint $table) {

            $table->smallIncrements('id')->unsigned();

            $table->string('folio_alta_diagnostico');

            $table->smallInteger('alta_id')->unsigned();
            $table->foreign('alta_id')->references('id')->on('altas')->onUpdate('cascade');

            $table->smallInteger('diagnostico_id')->unsigned();
            $table->foreign('diagnostico_id')->references('id')->on('diagnosticos')->onUpdate('cascade');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('alta_diagnostico');
    }
}
