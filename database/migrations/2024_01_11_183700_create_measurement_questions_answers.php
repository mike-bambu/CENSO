<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeasurementQuestionsAnswers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('measurement_questions_answers', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->smallInteger('quality_measurements_id')->unsigned();
            $table->string('folio_file')->nullable();
            $table->string('question')->nullable();
            $table->json('answers')->nullable();
            $table->boolean('is_measurable')->unsigned()->default(0);
            $table->boolean('test_pass')->unsigned()->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('measurement_questions_answers', function($table) {
            $table->foreign('quality_measurements_id')->references('id')->on('quality_measurements')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('measurement_questions_answers');
    }
}
