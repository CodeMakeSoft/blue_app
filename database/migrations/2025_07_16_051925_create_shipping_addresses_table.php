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
        Schema::create('shipping_addresses', function (Blueprint $table) {
            $table->id();
            $table->string('alias'); // Ej: "Casa", "Oficina"
            $table->string('street');
            $table->string('ext_number');
            $table->string('int_number')->nullable();
            $table->string('phone');
            $table->text('references')->nullable();
           
            $table->boolean('is_default')->default(false);

            $table->foreignId('user_id')->constrained()->onDelete('restrict'); 
            $table->foreignId('district_id')->constrained()->onDelete('restrict');
            
            $table->softDeletes();
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_addresses');
    }
};