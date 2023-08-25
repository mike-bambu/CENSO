<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentosAdjuntosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('documentos_adjuntos', function (Blueprint $table) {
            
            $table->smallIncrements('id')->unsigned();
            $table->string('url_documento')->nullable();
            $table->string('extension_documento')->nullable();
            $table->smallInteger('paciente_id')->unsigned()->index();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('documentos_adjuntos', function($table) {
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
        Schema::dropIfExists('documentos_adjuntos');
    }
}
