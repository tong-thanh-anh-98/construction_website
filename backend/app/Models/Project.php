<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'short_desc',
        'content',
        'construction_type',
        'sector',
        'location',
        'image',
        'status',
    ];

    protected $appends = ['image_url'];

    /**
     * Image URL
     */
    public function getImageUrlAttribute(): string
    {
        if ($this->image && file_exists(public_path('uploads/projects/small/' . $this->image))) {
            return url('uploads/projects/small/' . $this->image);
        }

        return url('uploads/images/no_img.jpg');
    }
}
