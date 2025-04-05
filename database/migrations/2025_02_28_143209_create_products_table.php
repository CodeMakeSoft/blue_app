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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('image')->nullable();
            $table->decimal('price',8,2);// Precio del Producto
            $table->integer('stock');
            $table->string('size')->nullable(); //Talla del producto: S, M, L, XL
            $table->string('color')->nullable(); //Color del producto
            $table->boolean('status')->default(true); //Estado del producto: 1 = Activo, 0 = Inactivo	
            $table->timestamp('availability')->nullable(); //Fecha de disponibilidad del producto
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); //Clave foránea de la tabla categories
            $table->foreignId('brand_id')->constrained(); //Clave foránea de la tabla brands
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
