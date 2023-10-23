<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMunicipiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('municipios', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('clave', 191);
			$table->string('nombre', 191);
			$table->integer('entidades_id')->default(7);
			$table->smallInteger('distritos_id')->unsigned();
			$table->timestamps();
			$table->softDeletes();
        });

        Schema::table('municipios', function($table) {
            $table->foreign('distritos_id')->references('id')->on('distritos')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('municipios');
    }
}
