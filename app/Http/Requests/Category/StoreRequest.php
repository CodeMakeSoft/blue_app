<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('categories', 'name')->where(function ($query) {
                    // Asegurar que el nombre sea único dentro del mismo nivel padre
                    return $query->where('parent_id', $this->parent_id);
                })
            ],
            'description' => ['required', 'string', 'max:255'],
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                // Evitar que una categoría sea padre de sí misma
                function ($attribute, $value, $fail) {
                    if ($this->category && $value == $this->category->id) {
                        $fail('Una categoría no puede ser padre de sí misma.');
                    }
                },
                // Evitar jerarquías circulares
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $parent = \App\Models\Category::find($value);
                        $current = $this->category ?? null;
                        
                        while ($parent) {
                            if ($current && $parent->id == $current->id) {
                                $fail('No se puede crear una jerarquía circular.');
                                break;
                            }
                            $parent = $parent->parent;
                        }
                    }
                }
            ],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.unique' => 'Ya existe una categoría con este nombre en el mismo nivel.',
            'parent_id.exists' => 'La categoría padre seleccionada no existe.',
        ];
    }
}