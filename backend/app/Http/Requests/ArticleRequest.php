<?php

namespace App\Http\Requests;

use App\Helpers\SlugHelper;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ArticleRequest extends FormRequest
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
            'author'            => 'required|string',
            'content'           => 'nullable|string',
            'image'             => 'nullable|string',
            'status'            => 'required|integer|in:0,1',
        ];

        if ($this->isMethod('post')) {
            $rules['slug'] = ['required', 'string', Rule::unique('articles', 'slug')];
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['slug'] = [
                    'required',
                    'string',
                    Rule::unique('articles', 'slug')->ignore($this->route('article')),
            ];
        }

        return $rules;
    }
}
