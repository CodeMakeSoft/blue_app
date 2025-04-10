<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateRequest extends FormRequest
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
        'name' => ['required', 'string', 'max:50','unique:categories,name,'.$this->route('category')->id],
        'description' => ['required', 'string', 'max:255'],
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'deleted_image' => 'nullable|boolean',
        ];
    }
}
