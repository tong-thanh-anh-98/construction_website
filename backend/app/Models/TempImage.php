<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TempImage extends Model
{
    use SoftDeletes;

    protected $fillable = ['name'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->name === "") {
            return "";
        }

        return asset('/uploads/temp/thumb/' . $this->name);
    }
}
