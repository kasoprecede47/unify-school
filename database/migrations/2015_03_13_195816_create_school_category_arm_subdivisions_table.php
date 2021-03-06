<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateSchoolCategoryArmSubdivisionsTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('school_category_arm_subdivisions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('school_category_arm_id');
            $table->string('name');
            $table->string('display_name');
            $table->text('meta');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('school_category_arm_subdivisions');
    }

}
