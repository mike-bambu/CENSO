<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoleUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role_user', function (Blueprint $table) {

            $table->foreignId('role_id')->constrained();
            $table->foreignId('user_id')->constrained();

            // $table->unsignedSmallInteger('role_id');
            // $table->unsignedSmallInteger('user_id');

            // $table->foreign('user_id')->references('id')->on('users');
            //->onDelete('cascade')
            // $table->foreign('role_id')->references('id')->on('roles');
            //->onDelete('cascade')
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('role_user');
    }
}
