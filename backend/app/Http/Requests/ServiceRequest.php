<?php

namespace App\Http\Requests;

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
            // store
            $rules['slug'] = [
                Rule::unique('services', 'slug'),
            ];
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            // update
            $rules['slug'] = [
                Rule::unique('services', 'slug')->ignore($this->route('service')),
            ];
        }

        return $rules;
    }
}
