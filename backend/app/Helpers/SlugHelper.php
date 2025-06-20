<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class SlugHelper
{
    public static function generateSlug($string)
    {
        $string = self::removeVietnameseTones($string);

        // Thay thế & bằng "va"
        $string = str_replace('&', 'va', $string);

        // Thay thế / bằng -
        $string = str_replace('/', '-', $string);

        // Tạo slug
        return Str::slug($string, '-');
    }

    private static function removeVietnameseTones($str)
    {
        $str = preg_replace([
            "/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/",
            "/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/",
            "/(ì|í|ị|ỉ|ĩ)/",
            "/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/",
            "/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/",
            "/(ỳ|ý|ỵ|ỷ|ỹ)/",
            "/(đ)/",
            "/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/",
            "/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/",
            "/(Ì|Í|Ị|Ỉ|Ĩ)/",
            "/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/",
            "/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/",
            "/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/",
            "/(Đ)/"
        ], [
            "a",
            "e",
            "i",
            "o",
            "u",
            "y",
            "d",
            "A",
            "E",
            "I",
            "O",
            "U",
            "Y",
            "D"
        ], $str);

        return $str;
    }
}
