<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServicioUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servicio_user', function (Blueprint $table) {

            $table->smallIncrements('id')->unsigned();

            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedSmallInteger('servicio_id')->index();

            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
            $table->foreign('servicio_id')->references('id')->on('servicios')->onUpdate('cascade');
            

        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('servicio_user');
    }
}

