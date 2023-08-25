<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDistritoUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('distrito_user', function (Blueprint $table) {

            $table->unsignedsmallInteger('distrito_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('dispositivo_id')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::table('distrito_user', function($table) {
            $table->foreign('distrito_id')->references('id')->on('distritos')->onUpdate('cascade');
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
        Schema::dropIfExists('distrito_user');
    }
}
