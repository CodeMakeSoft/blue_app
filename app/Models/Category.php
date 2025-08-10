<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name', 
        'description',
        'url',
        'parent_id' // Añadido para asignación masiva
    ];

    /**
     * Obtiene la categoría padre.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Obtiene las subcategorías.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')
            ->with('children'); // Carga eager de hijos recursivos
    }

    /**
     * Obtiene todos los productos de esta categoría.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Obtiene la imagen asociada a la categoría.
     */
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    /**
     * Obtiene todas las categorías raíz.
     */
    public static function rootCategories()
    {
        return static::with(['children', 'image'])
            ->whereNull('parent_id')
            ->get();
    }

    /**
     * Obtiene todos los descendientes de la categoría.
     */
    public function getAllDescendants()
    {
        $descendants = collect();
        
        foreach ($this->children as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($child->getAllDescendants());
        }
        
        return $descendants;
    }

    /**
     * Obtiene todos los productos incluyendo subcategorías.
     */
    public function getAllProducts()
    {
        $products = $this->products;
        
        foreach ($this->getAllDescendants() as $descendant) {
            $products = $products->merge($descendant->products);
        }
        
        return $products;
    }

    /**
     * Obtiene la ruta completa de la categoría.
     */
    public function getFullPath($separator = ' > ')
    {
        $path = [];
        $category = $this;
        
        while ($category) {
            array_unshift($path, $category->name);
            $category = $category->parent;
        }
        
        return implode($separator, $path);
    }

    /**
     * Scope para categorías con imágenes.
     */
    public function scopeWithImages($query)
    {
        return $query->whereHas('image');
    }
}