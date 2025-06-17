<?php

namespace App\Http\Requests;

use App\Helpers\SlugHelper;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Method prepareForValidation
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $slugInput = $this->input('slug') ?: $this->input('title');
        if ($slugInput) {
            $this->merge([
                'slug' => SlugHelper::generateSlug($slugInput)
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'title'       => 'required',
            'short_desc'  => 'nullable|string',
            'content'     => 'nullable|string',
            'status'      => 'required|in:0,1',
        ];

        if ($this->isMethod('post')) {
            // Tạo mới
            $rules['slug'] = 'required|string|unique:services,slug';
        } elseif ($this->isMethod('put') || $this->isMethod('patch')) {
            // Cập nhật
            $routeParam = $this->route('service'); // có thể là object hoặc string ID
            $serviceId = is_object($routeParam) ? $routeParam->id : $routeParam;

            $rules['slug'] = [
                'required',
                'string',
                Rule::unique('services', 'slug')->ignore($serviceId),
            ];
        }

        return $rules;
    }
}
