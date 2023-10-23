<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClueUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clue_user', function (Blueprint $table) {

            $table->string('clue_id');
            $table->unsignedBigInteger('user_id');
            $table->string('dispositivo_id')->nullable();
            
        });
        Schema::table('clue_user', function($table) {
            $table->foreign('clue_id')->references('id')->on('clues');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clue_user');
    }
}
