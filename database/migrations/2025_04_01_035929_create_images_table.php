<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */


    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('url');  // Campo para almacenar la URL/ruta
            $table->unsignedBigInteger('imageable_id');  // Para la relación polimórfica
            $table->string('imageable_type');  // Para la relación polimórfica
            $table->timestamps();
            
            // Índices para mejor rendimiento
            $table->index(['imageable_id', 'imageable_type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('images');
    }
};

