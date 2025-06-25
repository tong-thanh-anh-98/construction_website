<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'author',
        'content',
        'image',
        'status',
    ];

    protected $appends = ['image_url'];

    /**
     * Image URL
     */
    public function getImageUrlAttribute(): string
    {
        if ($this->image && file_exists(public_path('uploads/articles/small/' . $this->image))) {
            return url('uploads/articles/small/' . $this->image);
        }

        return url('uploads/images/no_img.jpg');
    }
}
