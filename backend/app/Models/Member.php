<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Member extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'image',
        'job_title',
        'linkedin_url',
        'status'
    ];

    protected $appends = ['image_url'];

    /**
     * Image URL
     */
    public function getImageUrlAttribute(): string
    {
        if ($this->image && file_exists(public_path('uploads/members/small/' . $this->image))) {
            return url('uploads/members/small/' . $this->image);
        }

        return url('uploads/images/no_img.jpg');
    }
}
