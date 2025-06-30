<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'testimonial',
        'citation',
        'image',
        'status',
        'designation'
    ];

    protected $appends = ['image_url'];

    /**
     * Image URL
     */
    public function getImageUrlAttribute(): string
    {
        if ($this->image && file_exists(public_path('uploads/testimonials/small/' . $this->image))) {
            return url('uploads/testimonials/small/' . $this->image);
        }

        return url('uploads/images/no_img.jpg');
    }
}
