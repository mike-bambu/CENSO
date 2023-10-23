<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocalidadesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('localidades', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('clave', 191);
			$table->string('nombre', 191);
			$table->float('numeroLatitud', 10, 0);
			$table->float('numeroLongitud', 10, 0);
			$table->integer('numeroAltitud');
			$table->string('claveCarta', 6);
            $table->integer('entidades_id')->default(7);
            $table->smallInteger('municipios_id')->unsigned();
			$table->timestamps();
			$table->softDeletes();
        });

        Schema::table('localidades', function($table) {
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
        Schema::dropIfExists('localidades');
    }
}
