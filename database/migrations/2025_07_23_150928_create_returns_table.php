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
    Schema::create('returns', function (Blueprint $table) {
        $table->id();
        $table->string('order_number');  // Número de pedido
        $table->text('reason');          // Razón de la devolución
        $table->timestamps();
    });
}

};
