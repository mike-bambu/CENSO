<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAltasEsPuerperaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('altas', function (Blueprint $table) {

            $table->boolean('esPuerperaEmbarazada')->unsigned()->nullable()->index()->after('observaciones_diagnosticos');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('altas', function (Blueprint $table) {
            
            $table->dropColumn('esPuerpera');
            
        });
    }
}
