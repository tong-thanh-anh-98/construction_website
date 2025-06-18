<?php

namespace App\Http\Requests;

use App\Helpers\SlugHelper;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
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
            'title'             => 'required|string',
            'short_desc'        => 'nullable|string',
            'content'           => 'nullable|string',
            'construction_type' => 'nullable|string',
            'sector'            => 'nullable|string',
            'location'          => 'nullable|string',
            'image'             => 'nullable|string',
            'status'            => 'required|integer|in:0,1',
        ];

        if ($this->isMethod('post')) {
            $rules['slug'] = 'required|string|unique:projects,slug';
        } elseif ($this->isMethod('put') || $this->isMethod('patch')) {
            $routeParam = $this->route('project'); // có thể là object hoặc string ID
            $projectId = is_object($routeParam) ? $routeParam->id : $routeParam;

            $rules['slug'] = [
                'required',
                'string',
                Rule::unique('projects', 'slug')->ignore($projectId),
            ];
        }

        return $rules;
    }
}
