<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQualityMeasurements extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quality_measurements', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->bigInteger('user_id')->unsigned();
            $table->string('clues_id')->nullable()->index();
            $table->boolean('is_active')->unsigned()->default(1);
            $table->integer('total_files')->unsigned()->nullable()->index();
            $table->integer('reviewed_files')->unsigned()->nullable()->default(0)->index();
            $table->string('measurement_type')->index();
            $table->date('date_start')->nullable();
            $table->date('date_finish')->nullable();
            $table->string('last_folio_file')->nullable();
            $table->string('month_measurement')->nullable()->index();
            $table->year('year_measurement')->nullable()->index();
            $table->integer('current_question')->unsigned()->default(0)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('quality_measurements', function($table) {
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
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
        Schema::dropIfExists('quality_measurements');
    }
}
