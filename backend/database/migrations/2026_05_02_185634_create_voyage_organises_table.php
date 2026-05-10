<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('voyage_organises', function (Blueprint $table) {
        $table->id();
        $table->string('destination');
        $table->string('title');
        $table->string('duree');
        $table->string('date');
        $table->string('personnes');
        $table->string('prix');
        $table->string('image')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voyage_organises');
    }
};
