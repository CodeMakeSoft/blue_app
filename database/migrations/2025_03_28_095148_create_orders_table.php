<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('transaction_id')->nullable(); // Para PayPal
            $table->decimal('total', 10, 2);
            $table->string('status')->default('pending'); // pending, completed, cancelled
            $table->string('payment_method'); // cod o paypal
            $table->timestamps();
        });        
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
